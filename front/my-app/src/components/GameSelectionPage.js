// --- START OF FILE components/GameSelectionPage.js ---
import React from 'react';

// 실제 이미지 URL로 교체하거나 public 폴더에 이미지 저장 후 경로 사용
const gamesData = [
  {
    id: 'pacman',
    name: '오목',
    image: 'https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/b155ec4371bfac6774616c179833758e.png', // 예시 이미지
    bgColor: '#000000', // 아이콘 이름 배경색
  },
  {
    id: 'angrybirds',
    name: '몰라',
    image: 'https://play-lh.googleusercontent.com/yP36E535992cR6c7llG9eQ00A83A20SnS7E2FqPnb9r33qc5oHqcQ_j4ZDLwE7S7uA', // 예시 이미지
    bgColor: '#000000',
  },
  {
    id: 'samgukji',
    name: '게임입니다', // 예시 이름
    image: 'https://cdn.ruliweb.com/ruliboard/23/10/24/18b603819213fb310.png', // 예시 이미지 (삼국지 인물 이미지)
    bgColor: '#000000',
  },
  // 필요시 더 많은 게임 추가
];

const GameItem = ({ game }) => {
    // 실제 게임 실행 로직은 여기에 추가
    const handleGameClick = () => {
        alert(`${game.name} 게임을 시작합니다! (구현 필요)`);
    };

    return (
        <div className="game-item" onClick={handleGameClick}>
            <img src={game.image} alt={game.name} className="game-item-image" />
            <div className="game-item-name-tag" style={{ backgroundColor: game.bgColor }}>
                {game.name}
            </div>
        </div>
    );
};

const GameSelectionPage = () => {
    return (
        <div className="game-selection-page">
            {gamesData.map(game => (
                <GameItem key={game.id} game={game} />
            ))}
        </div>
    );
};

export default GameSelectionPage;
// --- END OF FILE components/GameSelectionPage.js ---