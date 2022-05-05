// load comments from api
$.get('https://smileschool-api.hbtn.info/quotes', (data) => {
  console.log('cmntData', data);
  const cmntList = [];
  for (let item of data) {
    cmntList.push(createCmnt(item));
  }
  console.log(cmntList);
  oneStepCaro_nItems(cmntList, 1, $('.comments .carousel-inner')[0]);
})
  .done(() => { $('.comments .loader').hide(); });

// load most popular videos from api
$.get('https://smileschool-api.hbtn.info/popular-tutorials', (data) => {
  // console.log('data', data);
  const cardList = [];
  for (let item of data) {
    cardList.push(createCard(item));
  }
  console.log(cardList);
  oneStepCaro_nItems(cardList, 4, $('.pop-vids-4 .carousel-inner')[0]);
  oneStepCaro_nItems(cardList, 2, $('.pop-vids-2 .carousel-inner')[0]);
  oneStepCaro_nItems(cardList, 1, $('.pop-vids-1 .carousel-inner')[0]);
})
  .done(() => { $('.most-pop .loader').hide(); });

function createCmnt(info) {
  const cmnt = $('<div class="d-flex flex-column flex-md-row justify-content-around justify-content-md-center align-items-center">')[0];
  let cmntContent = `<img class="img-fluid rounded-circle mb-4 mb-md-0" src="${info.pic_url}" alt="profile_5" width="160px" height="160px">
      <div class="comment-text ml-md-5 mr-md-0 flex-column">
        <div>« ${info.text}</div>
        <h4 class="mt-3 mb-0">${info.name}</h4>
        <i>${info.title}</i>
      </div>`;
  $(cmnt).append(cmntContent);
  return cmnt;
}

function createCard(info) {
  const card = document.createElement('div');
  $(card).addClass('card border-0');
  let cardContent = `<div class="card-header">
      <img src="${info.thumb_url}" width="255" height="154">
      <img class="play-btn" src="images/play.png" width="64" height="64">
    </div>
    <div class="card-body">
      <h5 class="card-title mt-3"><b>${info.title}</b></h5>
      <small class="card-text">${info['sub-title']}</small>
      <div class="d-flex flex-row align-items-center mt-3">
        <img class="rounded-circle" src="${info.author_pic_url}" width="30" height="30">
        <small class="text-purple ml-2"><b>${info.author}</b></small>
      </div>
      <div class="d-flex flex-row align-items-center justify-content-between mt-2">
        <div class="d-flex justify-content-between align-items-center w-50">`;
  for (var i = 0; i < info.star; ++i) {
    cardContent += `<img src="images/star_on.png" width="15" height="15">`;
  }
  while(i++ < 5) {
    cardContent += `<img src="images/star_off.png" width="15" height="15">`;
  }
  cardContent += `</div>
        <small class="text-purple"><b>${info.duration}</b></small>
      </div>
    </div>`;
  $(card).append(cardContent);
  return card;
}

function oneStepCaro_nItems(cardList, nItems, target) {
  // console.log('cardList', cardList);
  // console.log('nItems', nItems);
  // console.log('target', target);
  for (let i = 0; i < cardList.length; ++i) {
    var carouselItem = $('<div class=carousel-item></div>')[0];
    // check for the correct type of object being added for parent settings
    if ($(cardList[0]).hasClass('card')) {
      var flexSetup = $('<div class="d-flex flex-row justify-content-around"></div>')[0];
    } else {
      var flexSetup = document.createDocumentFragment();
    }
    if (!i) {
      $(carouselItem).addClass('active');
    }
    for (let j = i; j < i + nItems; ++j) {
      flexSetup.append(cardList[j % cardList.length]);
    }
    carouselItem.append(flexSetup.cloneNode(true));
    target.append(carouselItem.cloneNode(true));
  }
}



