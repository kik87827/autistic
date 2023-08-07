window.addEventListener("DOMContentLoaded", () => {
  commonInit();
});
window.addEventListener("load", () => {
  layoutFunc();
});

/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf('samsung') > -1) {
    browserAdd("samsung");
  }

  if (navigator.platform.indexOf('Win') > -1 || navigator.platform.indexOf('win') > -1) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }


  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/**
 * 레이아웃
 */
function layoutFunc() {
  const header_wrap = document.querySelector(".header_wrap");
  const bg_twonav = document.querySelector(".bg_twonav");
  const nav_oneitem = document.querySelectorAll(".nav_oneitem");
  const nav_list_li = document.querySelectorAll(".nav_list > li");
  const nav_twoitem_list_wrap = document.querySelectorAll(".nav_twoitem_list_wrap");
  let arrayHeightTwo = [];

  // init
  initGnb();

  // event
  nav_list_li.forEach((item) => {
    item.addEventListener("mouseenter", (e) => {
      const thisItem = e.currentTarget;
      const thisSiblings = siblings(thisItem);

      thisSiblings.forEach((item) => {
        item.classList.remove("active");
      });

      twodepthActive();

      thisItem.classList.add("active");
    });
  });
  header_wrap.addEventListener("mouseleave", () => {
    twodepthInActive();
  });

  // function
  function initGnb() {
    arrayHeightTwo = getMaxHeightTwo();
    header_wrap.classList.add("ready");
    nav_oneitem.forEach((item) => {
      item.style.width = item.getBoundingClientRect().width + 'px';
    });
  }

  function getMaxHeightTwo() {
    let arrayHeight = [];
    nav_twoitem_list_wrap.forEach((item) => {
      arrayHeight.push(item.getBoundingClientRect().height);
    });
    return Math.max.apply(null, arrayHeight);
  }

  function twodepthActive() {
    nav_twoitem_list_wrap.forEach((item) => {
      item.classList.add("active");
    });
    setTimeout(() => {
      bg_twonav.style.height = arrayHeightTwo + 'px';
      nav_twoitem_list_wrap.forEach((item) => {
        item.style.height = arrayHeightTwo + 'px';
      });
    }, 20);
  }

  function twodepthInActive() {
    bg_twonav.style.height = '0px';
    nav_twoitem_list_wrap.forEach((item) => {
      item.style.height = '0px';
    });
    setTimeout(() => {
      nav_twoitem_list_wrap.forEach((item) => {
        item.classList.add("active");
      });
    }, 400);
    nav_list_li.forEach((item) => {
      item.classList.remove("active");
    });
  }
}

/**
 * menu rock
 */
function menuRock(target) {
  const targetDom = document.querySelector(target);
  if (!!targetDom) {
    targetDom.classList.add("active");
  }
}

function siblings(t) {
  var children = t.parentElement.children;
  var tempArr = [];

  for (var i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function(e) {
    return e != t;
  });
}