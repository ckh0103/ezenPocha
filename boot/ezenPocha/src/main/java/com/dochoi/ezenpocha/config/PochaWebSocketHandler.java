package com.dochoi.ezenpocha.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import com.dochoi.ezenpocha.service.TableService; // TableService 임포트
import com.dochoi.ezenpocha.vo.TableStatusDTO;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.net.URI; // URI 임포트 추가
import java.util.Optional; // Optional 임포트 추가

@Component
public class PochaWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String CLIENT_ID_ATTRIBUTE = "clientId";

    private final TableService tableService; // TableService 주입

    public PochaWebSocketHandler(TableService tableService) {
        this.tableService = tableService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String id = null;
        try {
            // URI 객체에서 쿼리 파라미터를 파싱합니다.
            // Map<String, String> params = UriComponentsBuilder.fromUri(session.getUri()).build().getQueryParams().toSingleValueMap();
            // id = params.get("id"); // Spring 5.x 이상에서 UriComponentsBuilder 사용 가능
            
            // UriComponentsBuilder를 사용할 수 없다면, 직접 파싱하는 로직을 더 안전하게 구현합니다.
            URI uri = session.getUri();
            if (uri != null) {
                String query = uri.getQuery();
                if (query != null) {
                	System.out.println("DEBUG: WebSocket Query String: " + query); // DEBUG 로그 추가
                    for (String param : query.split("&")) {
                        if (param.startsWith("id=")) {
                            id = param.substring(3);
                            break;
                        }
                    }
                }
            }

            if (id != null && !id.isEmpty()) { // id가 null이 아니고 비어있지 않아야 함
                session.getAttributes().put(CLIENT_ID_ATTRIBUTE, id);
                sessions.put(id, session);
                System.out.println("WebSocket 연결됨: 클라이언트 ID: " + id + ", Session ID: " + session.getId());

                broadcastAllTableStatuses();

            } else {
                // ID 파라미터가 없거나 비어있는 경우
                System.err.println("WebSocket 연결 실패: ID 파라미터가 없거나 유효하지 않습니다. Session ID: " + session.getId() + ", Query: " + (uri != null ? uri.getQuery() : "null"));
                session.close(CloseStatus.BAD_DATA.withReason("Missing or invalid 'id' parameter"));
            }
        } catch (Exception e) {
            System.err.println("WebSocket 연결 설정 중 오류 발생: Session ID: " + session.getId() + ", Error: " + e.getMessage());
            session.close(CloseStatus.SERVER_ERROR.withReason("Internal server error during connection setup"));
        }

    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String currentClientId = (String) session.getAttributes().get(CLIENT_ID_ATTRIBUTE);
        System.out.println("메시지 수신 (" + currentClientId + "): " + message.getPayload());

        try {
            Map<String, Object> messageMap = objectMapper.readValue(message.getPayload(), new TypeReference<Map<String, Object>>() {});
            String type = (String) messageMap.get("type");
            Map<String, Object> msgPayload = (Map<String, Object>) messageMap.get("payload");

            if (msgPayload == null || !msgPayload.containsKey("to") || msgPayload.get("to") == null) {
                System.out.println("No specific 'to' ID specified for message type: " + type + ". Processing internally.");

                switch (type) {
                    case "enter_table":
                        tableService.enterTable(messageMap);
                        System.out.println("테이블 " + msgPayload.get("tableId") + " 입장 및 상태 업데이트 완료.");
                        break;
                    case "place_order":
                        tableService.placeOrder(messageMap);
                        System.out.println("테이블 " + msgPayload.get("tableId") + " 주문 접수 완료.");
                        break;
                    case "staff_call":
                        System.out.println("직원 호출: " + msgPayload.get("tableName") + " (" + msgPayload.get("tableId") + ")");
                        // 관리자에게만 특정 알림을 보내는 로직을 추가할 수 있습니다.
                        
                        WebSocketSession adminSession = sessions.get("admin");
                        if (adminSession != null && adminSession.isOpen()) {
                            adminSession.sendMessage(new TextMessage(message.getPayload())); // 원본 메시지 그대로 전달
                            System.out.println("직원 호출 메시지 'admin' 세션에 전송 성공.");
                        } else {
                            System.err.println("직원 호출 메시지 전송 실패: 'admin' 세션을 찾을 수 없거나 연결이 끊어짐.");
                        }
                        break;
                        
                    case "clear_table":
                        tableService.clearTable(messageMap);
                        System.out.println("테이블 " + msgPayload.get("tableId") + " 초기화 완료.");
                        break;
                    case "request_all_tables_status":
                        // 이 메시지를 받으면 현재 상태를 브로드캐스트 (client.js에서 연결 시 보낼 수도 있음)
                        break;
                    default:
                        System.out.println("알 수 없는 메시지 타입 (to 필드 없음): " + type);
                        break;
                }
                if (!type.equals("staff_call")) { // staff_call인 경우만 제외
                    broadcastAllTableStatuses();
                }
                return;
            }

            String toId = (String) msgPayload.get("to");
            WebSocketSession targetSession = sessions.get(toId);

            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(message.getPayload()));
                System.out.println("메시지 전송 성공: " + toId + " <-- " + currentClientId + " (Type: " + type + ")");
            } else {
                System.err.println("메시지 전송 실패: 타겟 세션을 찾을 수 없거나 연결이 끊어짐. (Target ID: " + toId + ", From ID: " + currentClientId + ", Type: " + type + ")");
                if (session.isOpen()) {
                    String errorMsg = objectMapper.writeValueAsString(Map.of(
                        "type", "error",
                        "payload", Map.of(
                            "message", "상대방 테이블이 연결되어 있지 않거나 세션을 찾을 수 없습니다.",
                            "originalType", type,
                            "targetId", toId
                        )
                    ));
                    session.sendMessage(new TextMessage(errorMsg));
                }
            }

        } catch (Exception e) {
            System.err.println("메시지 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            if (session.isOpen()) {
                String errorMsg = objectMapper.writeValueAsString(Map.of(
                    "type", "error",
                    "payload", Map.of(
                        "message", "메시지 처리 중 내부 오류가 발생했습니다.",
                        "errorDetails", e.getMessage()
                    )
                ));
                session.sendMessage(new TextMessage(errorMsg));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String clientIdToRemove = (String) session.getAttributes().get(CLIENT_ID_ATTRIBUTE);
        if (clientIdToRemove != null) {
            sessions.remove(clientIdToRemove);
            System.out.println("WebSocket 연결 종료: 클라이언트 ID: " + clientIdToRemove + ", Session ID: " + session.getId() + ", Status: " + status);
            broadcastAllTableStatuses(); // 연결 종료 시에도 상태 업데이트 브로드캐스트
        } else {
            System.out.println("알 수 없는 세션 종료됨 (클라이언트 ID 없음): Session ID: " + session.getId() + ", Status: " + status);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        String clientIdToRemove = (String) session.getAttributes().get(CLIENT_ID_ATTRIBUTE);
        System.err.println("WebSocket 전송 오류 발생: 클라이언트 ID: " + clientIdToRemove + ", Session ID: " + session.getId() + ", Error: " + exception.getMessage());
        if (clientIdToRemove != null) {
            sessions.remove(clientIdToRemove);
            System.out.println("오류로 인해 세션 제거됨: 클라이언트 ID: " + clientIdToRemove);
            broadcastAllTableStatuses();
        }
        session.close(CloseStatus.SERVER_ERROR);
    }

    private void broadcastAllTableStatuses() {
        try {
            List<TableStatusDTO> allTables = tableService.getAllTableStatus();
            String messageToSend = objectMapper.writeValueAsString(Map.of("type", "all_tables_status", "payload", allTables));

            for (WebSocketSession s : sessions.values()) {
                if (s.isOpen()) {
                    s.sendMessage(new TextMessage(messageToSend));
                }
            }
            System.out.println("모든 테이블 현황 브로드캐스트 완료.");
        } catch (IOException e) {
            System.err.println("모든 테이블 현황 브로드캐스트 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
}