window.onload = () => {
  loadAllCarousels();
}

function loadAllCarousels() {
  // load comments from api
  if ($('.comments .carousel-inner').length) {
    $.get('https://smileschool-api.hbtn.info/xml/quotes', (data) => {
      // console.log('cmntData', data);
      // console.log(data.childNodes[0]);
      const cmntList = [];
      for (let item of data.childNodes[0].childNodes) {
        cmntList.push(createCmnt(item));
      }
      // console.log(cmntList);
      oneStepCaro_nItems(cmntList, 1, $('.comments .carousel-inner'));
    })
      .done(() => { $('.comments .loader').hide(); });
  }

  // load most popular videos from api
  if ($('.most-pop .pop-vids-4 .carousel-inner').length) {
    $.get('https://smileschool-api.hbtn.info/xml/popular-tutorials', (data) => {
      console.log('mostPopData', data);
      console.log(data.childNodes[0]);
      const cardList = [];
      for (let item of data.childNodes[0].childNodes) {
        cardList.push(createCard(item));
      }
      // console.log(cardList);
      oneStepCaro_nItems(cardList, 4, $('.most-pop .pop-vids-4 .carousel-inner'));
      oneStepCaro_nItems(cardList, 2, $('.most-pop .pop-vids-2 .carousel-inner'));
      oneStepCaro_nItems(cardList, 1, $('.most-pop .pop-vids-1 .carousel-inner'));
    })
      .done(() => { $('.most-pop .loader').hide(); });
  }

  // load latest videos from api
  if ($('.latest .pop-vids-4 .carousel-inner').length) {
    $.get('https://smileschool-api.hbtn.info/xml/latest-videos', (data) => {
      // console.log('latestData', data);
      const cardList = [];
      for (let item of data.childNodes[0].childNodes) {
        cardList.push(createCard(item));
      }
      // console.log(cardList);
      oneStepCaro_nItems(cardList, 4, $('.latest .pop-vids-4 .carousel-inner'));
      oneStepCaro_nItems(cardList, 2, $('.latest .pop-vids-2 .carousel-inner'));
      oneStepCaro_nItems(cardList, 1, $('.latest .pop-vids-1 .carousel-inner'));
    })
      .done(() => { $('.latest .loader').hide(); });
  }

  // load courses section from api
  if ($('.results .row').length) {
    getCourses($('.results .row'));
    // set the form submittal to run correctly
    $('form.container').submit((e) => {
      e.preventDefault();
      getCourses($('.results .row'));
    });
  }
}

function createCmnt(info) {
  // console.log('createCmnt', info);
  // console.log('pic_url', info.childNodes[0].textContent);
  const cmnt = $('<div class="d-flex flex-column flex-md-row justify-content-around justify-content-md-center align-items-center">')[0];
  let cmntContent = `<img class="img-fluid rounded-circle mb-4 mb-md-0" src="${info.childNodes[0].textContent}" alt="profile_5" width="160px" height="160px">
      <div class="comment-text ml-md-5 mr-md-0 flex-column">
        <div>« ${info.childNodes[3].textContent}</div>
        <h4 class="mt-3 mb-0">${info.childNodes[1].textContent}</h4>
        <i>${info.childNodes[2].textContent}</i>
      </div>`;
  $(cmnt).append(cmntContent);
  return cmnt;
}

function createCard(info) {
  // console.log('createCard', info);
  // console.log(info.childNodes[0].textContent);
  const card = $('<div class="card border-0"></div>')[0];
  let cardContent = `<div class="card-header">
      <img src="${info.childNodes[2].textContent}" width="255" height="154">
      <img class="play-btn" src="images/play.png" width="64" height="64">
    </div>
    <div class="card-body">
      <h5 class="card-title mt-3"><b>${info.childNodes[0].textContent}</b></h5>
      <small class="card-text">${info.childNodes[1].textContent}</small>
      <div class="d-flex flex-row align-items-center mt-3">
        <img class="rounded-circle" src="${info.childNodes[4].textContent}" width="30" height="30">
        <small class="text-purple ml-2"><b>${info.childNodes[3].textContent}</b></small>
      </div>
      <div class="d-flex flex-row align-items-center justify-content-between mt-2">
        <div class="d-flex justify-content-between align-items-center w-50">`;
  // console.log('stars', info.attributes[1].value);
  for (var i = 0; i < info.attributes[1].value; ++i) {
    cardContent += `<img src="images/star_on.png" width="15" height="15">`;
  }
  while(i++ < 5) {
    cardContent += `<img src="images/star_off.png" width="15" height="15">`;
  }
  cardContent += `</div>
        <small class="text-purple"><b>${info.childNodes[5].textContent}</b></small>
      </div>
    </div>`;
  $(card).append(cardContent);
  return card;
}

function createOption(info) {
  return $(`<option class="bg-white text-body" value="${info}">${capFirstLtr(info)}</option>`)[0];
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

function getCourses(target) {
  // clear out existing entries and show loader
  $('.results .loader').show();
  // console.log('target', target);
  $(target).empty();
  // grab all search parameters for api
  let keywords = $('#searchInput').val();
  let topic = $('#topicSelect').val();
  let sortBy = $('#exampleFormControlSelect1').val();
  // console.log('key:', keywords, 'top:', topic, 'sort:', sortBy);
  // set base api url
  let apiUrl = 'https://smileschool-api.hbtn.info/xml/courses?'
  // fill with search parameters if present
  if (keywords) {
    apiUrl += `&q=${keywords}`;
  }
  if (topic) {
    apiUrl += `&topic=${topic}`;
  }
  if (sortBy) {
    apiUrl += `&sort=${sortBy}`;
  }
  // console.log(apiUrl);
  $.get(apiUrl, (data) => {
      // console.log('coursesData', data);
      // console.log(data.childNodes[0].childNodes[5].childNodes);
      const cardList = [];
      for (let item of data.childNodes[0].childNodes[5].childNodes) {
        cardList.push(createCard(item));
      }
      // console.log('coursesList', cardList);
      let topics = $('.form-control#topicSelect')[0];
      let sorts = $('.form-control#exampleFormControlSelect1')[0];
      // check if the options are already there, if not fill them up!
      if (!topics.childElementCount) {
        // console.log('topics', data.childNodes[0].childNodes[0].childNodes);
        for (let option of data.childNodes[0].childNodes[0].childNodes) {
          $(topics).append(createOption(option.textContent));
        }
      }
      if (!sorts.childElementCount) {
        // console.log('sorts', data.childNodes[0].childNodes[2].childNodes);
        for (let option of data.childNodes[0].childNodes[2].childNodes) {
          $(sorts).append(createOption(option.textContent));
        }
      }
      // add event listeners
      if (!$(topics).hasClass('listener')) {
        $(topics).addClass('listener');
        $(topics).on('change', () => $(topics).closest('form').submit());
      }
      if (!$(sorts).hasClass('listener')) {
        $(sorts).addClass('listener');
        $(sorts).on('change', () => $(sorts).closest('form').submit());
      }
      fillCourses(cardList, target);
    })
      .done(() => { $('.results .loader').hide(); });
}

function fillCourses(cardList, target) {
  // console.log('cardList', cardList);
  // console.log('target', target);
  for (card of cardList) {
    var wrapper = $('<div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center my-2">')[0];
    wrapper.append(card);
    target.append(wrapper.cloneNode(true));
  }
}

function capFirstLtr(string) {
  let words = string.split('_');
  return words.map((word) => {return word[0].toUpperCase() + word.substring(1)}).join(" ");
}

