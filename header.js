function renderHeader(activePage) {
    // Determine marker class based on active page
    let markerClass = '';
    if (activePage === 'job') markerClass = 'nav-active-marker marker-job';
    else if (activePage === 'character') markerClass = 'nav-active-marker marker-character';
    else if (activePage === 'faction') markerClass = 'nav-active-marker marker-faction';
    else if (activePage === 'monster') markerClass = 'nav-active-marker marker-monster';

    let setMarker = markerClass ? `<div class="${markerClass}"></div>` : '';

    const headerHTML = `
    <div class="header">
        <img class="logo" src="img/로고.png" alt="Logo" onclick="window.location.href='index.html'" />
        
        ${setMarker}
        
        <div class="nav-item job ${activePage === 'job' ? 'active' : ''}" onclick="window.location.href='party.html'">파티원</div>
        <div class="nav-item character ${activePage === 'character' ? 'active' : ''}" onclick="window.location.href='key figures.html'">주요인물</div>
        <div class="nav-item faction ${activePage === 'faction' ? 'active' : ''}" onclick="window.location.href='faction.html'">세력</div>
        <div class="nav-item monster ${activePage === 'monster' ? 'active' : ''}" onclick="window.location.href='monster.html'">몬스터</div>
        
        <img class="play-btn-img" src="img/플레이.png" alt="Play" onclick="window.open('https://share.crack.wrtn.ai/v3snwy', '_blank')" />
    </div>
    `;

    document.write(headerHTML);
}
