window.addEventListener("DOMContentLoaded",()=>{
  commonInit();
  comboFunc();
});
window.addEventListener("load",()=>{
  layoutFunc();
  formItemFun();
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
function layoutFunc(){
  const header_wrap = document.querySelector(".header_wrap");
  const bg_twonav = document.querySelector(".bg_twonav");
  const nav_oneitem = document.querySelectorAll(".nav_oneitem");
  const nav_list_li = document.querySelectorAll(".nav_list > li");
  const nav_twoitem_list_wrap = document.querySelectorAll(".nav_twoitem_list_wrap");
  let arrayHeightTwo = [];

  if(!header_wrap){return;}

  // init
  initGnb();

  // event
  nav_list_li.forEach((item)=>{
    item.addEventListener("mouseenter",(e)=>{
      const thisItem = e.currentTarget;
      const thisSiblings = siblings(thisItem);

      thisSiblings.forEach((item)=>{
        item.classList.remove("active");
      });

      twodepthActive();

      thisItem.classList.add("active");
    });
  });
  header_wrap.addEventListener("mouseleave",()=>{
    twodepthInActive();
  });

  // function
  function initGnb(){
    arrayHeightTwo = getMaxHeightTwo();
    if(!!header_wrap){
      header_wrap.classList.add("ready");
      nav_oneitem.forEach((item)=>{
        item.style.width = item.getBoundingClientRect().width + 'px';
      });
    }
  }

  function getMaxHeightTwo(){
    let arrayHeight = []; 
    nav_twoitem_list_wrap.forEach((item)=>{
      arrayHeight.push(item.getBoundingClientRect().height);
    });
    return Math.max.apply(null,arrayHeight);
  }

  function twodepthActive(){
    nav_twoitem_list_wrap.forEach((item)=>{
      item.classList.add("active");
    });
    setTimeout(()=>{
      bg_twonav.style.height = arrayHeightTwo + 'px';
      nav_twoitem_list_wrap.forEach((item)=>{
        item.style.height = arrayHeightTwo + 'px';
      });
    },20);
  }
  function twodepthInActive(){
    bg_twonav.style.height = '0px';
    nav_twoitem_list_wrap.forEach((item)=>{
      item.style.height = '0px';
    });
    setTimeout(()=>{
      nav_twoitem_list_wrap.forEach((item)=>{
        item.classList.add("active");
      });
    },400);
    nav_list_li.forEach((item)=>{
      item.classList.remove("active");
    });
  }
}

/**
 * menu rock
 */
function menuRock(target){
  const targetDom = document.querySelector(target);
  if(!!targetDom){
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


/* map */
function renderApi(){
  const map_guide_toggle_group = document.querySelector(".map_guide_toggle_group");
  const btn_map_guide_toggle = document.querySelector(".btn_map_guide_toggle");
  if(!!btn_map_guide_toggle){
    btn_map_guide_toggle.addEventListener("click",(e)=>{
      e.preventDefault();
      e.currentTarget.closest(".map_guide_toggle_group").classList.toggle("active");
    });
  }

  document.addEventListener("click",(e)=>{
    if(!e.target.closest(".map_guide_toggle_group")){
      map_guide_toggle_group.classList.remove("active");
    }
  });
}


/* combo */
function comboFunc() {
  const combo_item = document.querySelectorAll(".combo_item");
  const combo_option_group = document.querySelectorAll(".combo_option_group");
  addDynamicEventListener(document.body, 'click', '.combo_target', function(e) {
    let thisTarget = e.target;
    let thisParent = thisTarget.closest(".combo_item");
    let thisOptionGroup = thisParent.querySelector(".combo_option_group");
    let appendOption = null;
    let combo_option_scroll = null;
    if (thisOptionGroup !== null) {
      comboInit(thisParent);
    }
    comboPosAction();
    // not
    combo_item.forEach((element) => {
      if (element !== thisParent) {
        element.classList.remove("active");
      }
    });
    appendOption = document.querySelector(`[data-option='${thisParent.getAttribute("id")}']`);
    combo_option_scroll = appendOption.querySelector(".combo_option_scroll");
    appendOptionListOption = combo_option_scroll.getAttribute("data-rowCount") !== null ? combo_option_scroll.getAttribute("data-rowCount") : 5;
    combo_option_group.forEach((element) => {
      if (element !== appendOption) {
        element.classList.remove("active");
      }
    });
    thisParent.classList.toggle("active");
    appendOption.classList.toggle("active");
    if (appendOption.classList.contains("active")) {
      if (combo_option_scroll.classList.contains("addHeight")) {
        return;
      }
      if (appendOption.querySelectorAll("li")[appendOptionListOption] !== undefined) {
        combo_option_scroll.style.maxHeight = `${appendOption.querySelectorAll("li")[appendOptionListOption].offsetTop}px`;
      }
      combo_option_scroll.classList.add("addHeight");
    }
  });
  addDynamicEventListener(document.body, 'click', '.combo_option', function(e) {
    let thisTarget = e.target;
    let thisParent = thisTarget.closest(".combo_option_group");
    let thisTargetText = thisTarget.textContent;
    let comboCallItem = document.querySelector(`[id='${thisParent.getAttribute('data-option')}']`);
    let comboCallTarget = comboCallItem.querySelector(".combo_target");

    if (thisTarget.classList.contains("disabled")) {
      return;
    }
    comboCallTarget.textContent = thisTargetText;
    thisParent.classList.remove("active");
    comboCallItem.classList.remove("active");
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest(".combo_item") !== null) {
      return;
    }
    comtoReset();
  });

  let currentWid = window.innerWidth;
  window.addEventListener("resize", () => {
    if (currentWid !== window.innerWidth) {
      comboPosAction();
    }
    currentWid = window.innerWidth;
  })

  function comtoReset() {
    const combo_item = document.querySelectorAll(".combo_item");
    const combo_option_group = document.querySelectorAll(".combo_option_group");

    combo_item.forEach((element) => {
      element.classList.remove("active");
    });
    combo_option_group.forEach((element) => {
      element.classList.remove("active");
    });
  }

  function comboInit() {
    const combo_item = document.querySelectorAll(".combo_item");
    const appBody = document.querySelector(".page_wrap");

    combo_item.forEach((element, index) => {
      let thisElement = element;
      let option_group = thisElement.querySelector(".combo_option_group");
      if (element.getAttribute("id") === null) {
        thisElement.setAttribute("id", 'combo_item_' + index);
        option_group.setAttribute("data-option", 'combo_item_' + index);
      } else {
        option_group.setAttribute("data-option", thisElement.getAttribute("id"));
      }
      if (element.closest(".fullpop_contlow") !== null) {
        element.closest(".fullpop_contlow").appendChild(option_group);
      } else {
        appBody.appendChild(option_group);
      }
    });
  }

  function comboPosAction() {
    const appendOption = document.querySelectorAll(".combo_option_group");
    appendOption.forEach((element, index) => {
      let comboCall = document.querySelector(`[id='${element.getAttribute("data-option")}']`);
      if (!comboCall) {
        return;
      }
      let combo_top = window.scrollY + comboCall.getBoundingClientRect().top;
      let fullpop_contlow_top = 0;
      let combo_left = comboCall.getBoundingClientRect().left;
      let fullpop_contlow_left = 0;

      if (comboCall.closest(".fullpop_contlow") !== null) {
        fullpop_contlow_top = comboCall.closest(".fullpop_contlow").getBoundingClientRect().top;
        fullpop_contlow_left = comboCall.closest(".fullpop_contlow").getBoundingClientRect().left;
        element.setAttribute("style", `
                    top : ${(combo_top - fullpop_contlow_top) + comboCall.getBoundingClientRect().height - 1}px; 
                    left : ${combo_left - fullpop_contlow_left}px;
                    width : ${ comboCall.getBoundingClientRect().width }px;
                `)
              } else {
        element.setAttribute("style", `
            top : ${combo_top + comboCall.getBoundingClientRect().height - 1}px; 
            left : ${combo_left}px;
            width : ${ comboCall.getBoundingClientRect().width }px;
        `)
        if(element.classList.contains("reverse_pos")){
          element.setAttribute("style", `
          top : ${combo_top - (element.getBoundingClientRect().height -2)}px; 
          left : ${combo_left}px;
            width : ${ comboCall.getBoundingClientRect().width }px;
        `)
        }
      }
    });
  }
}

function comboChangeCallback(option) {
  addDynamicEventListener(document.body, 'click', `[data-option='${option.target}'] .combo_option`, function(e) {
    let thisEventObj = e.target;
    let thisEventObjValue = thisEventObj.getAttribute("data-value");
    if ("callback" in option) {
      option.callback(thisEventObjValue);
    }
  });
}


/* toggle class */

function toggleClass(target){
  const targetDom = document.querySelectorAll(target);
  if(!!targetDom){
    targetDom.forEach((item) => {
      item.addEventListener("click",(e)=>{
        e.preventDefault();
        item.classList.toggle("active");
      })
    })
  }
}


/* input */

function formItemFun(){
  addDynamicEventListener(document.body, 'focusin', '.input_component_box .input_origin_item', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    thisTargetParent.classList.add("focus");
  });
  addDynamicEventListener(document.body, 'focusout', '.input_component_box .input_origin_item', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    thisTargetParent.classList.remove("focus");
  });
}