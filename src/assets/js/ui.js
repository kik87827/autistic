window.addEventListener("DOMContentLoaded",()=>{
  commonInit();
  comboFunc();
});
window.addEventListener("load",()=>{
  layoutFunc();
  formItemFunc();
  bottomFoldFunc();
  uiPickerRender();
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
  const map_screen_wrap = document.querySelector(".map_screen_wrap");
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
  document.querySelector("body").addEventListener("mouseleave",()=>{
    twodepthInActive();
  });
  if(!!map_screen_wrap){
    document.querySelector(".map_screen_wrap").addEventListener("mouseover",()=>{
      twodepthInActive();
    });
  }

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
  const innerScrollDom = [".popup_content_low"];

  addDynamicEventListener(document.body, 'click', '.combo_target', function(e) {
    let thisTarget = e.target;
    let thisParent = thisTarget.closest(".combo_item");
    let thisOptionGroup = thisParent.querySelector(".combo_option_group");
    let appendOption = null;
    let combo_option_scroll = null;
    if (thisOptionGroup !== null) {
      comboInit(thisParent);
    }
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
    comboRePosAction();
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
    comboReset();
  });

  window.addEventListener("resize", () => {
    // comboRePosAction();
    comboReset();
  })

  function comboReset() {
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

    comboReset();

    combo_item.forEach((element, index) => {
      let thisElement = element;
      let option_group = thisElement.querySelector(".combo_option_group");
      if (element.getAttribute("id") === null) {
        thisElement.setAttribute("id", 'combo_item_' + index);
        option_group.setAttribute("data-option", 'combo_item_' + index);
      } else {
        option_group.setAttribute("data-option", thisElement.getAttribute("id"));
      }
      
      if (!!element.closest(".popup_content_low")) {
        element.closest(".popup_content_low").appendChild(option_group);
      } else {
        appBody.appendChild(option_group);
      }
    });
  }

  // function comboPosAction() {
  //   const appendOption = document.querySelectorAll(".combo_option_group.active");
    


  //   appendOption.forEach((element, index) => {
  //     let comboCall = document.querySelector(`[id='${element.getAttribute("data-option")}']`);
  //     let comboCallLayerParent = comboCall.closest(".popup_content_low");
  //     if (!comboCall) {
  //       return;
  //     }

  //     let combo_top = window.scrollY + comboCall.getBoundingClientRect().top;
  //     let combo_layer_top = !!comboCallLayerParent ? comboCallLayerParent.scrollTop + comboCall.getBoundingClientRect().top : 0;

  //     let fullpop_contlow_top = 0;
  //     let combo_left = comboCall.getBoundingClientRect().left;
  //     let fullpop_contlow_left = 0;


  //     if (comboCall.closest(".popup_content_low") !== null) {
  //       fullpop_contlow_top = comboCall.closest(".popup_content_low").getBoundingClientRect().top;
  //       fullpop_contlow_left = comboCall.closest(".popup_content_low").getBoundingClientRect().left;
  //       element.setAttribute("style", `
  //                   top : ${(combo_layer_top - fullpop_contlow_top) + comboCall.getBoundingClientRect().height - 1}px; 
  //                   left : ${combo_left - fullpop_contlow_left}px;
  //                   width : ${ comboCall.getBoundingClientRect().width }px;
  //               `)
  //             } else {
        
  //       if(element.classList.contains("reverse_pos")){
  //         element.setAttribute("style", `
  //         top : ${combo_top+0.5}px; 
  //         left : ${combo_left+window.scrollX}px;
  //           width : ${ comboCall.getBoundingClientRect().width }px;
  //       `)
  //       }else{
  //         element.setAttribute("style", `
  //           top : ${combo_top + comboCall.getBoundingClientRect().height - 1}px; 
  //           left : ${combo_left+window.scrollX}px;
  //           width : ${ comboCall.getBoundingClientRect().width }px;
  //       `)
  //       }
  //     }
  //   });
  // }
  function comboRePosAction() {
    const appendOption = document.querySelector(".combo_option_group.active");
    if(!appendOption){return;}
    const comboCall = document.querySelector(".combo_item.active");
    let comboCallLayerParent = !!comboCall.closest(".popup_content_low") ? comboCall.closest(".popup_content_low") : null;

    if(!comboCall || !appendOption){return;}
    appendOption.removeAttribute("style");

    let combo_top = window.scrollY + comboCall.getBoundingClientRect().top;
    let combo_layer_top = !!comboCallLayerParent ? comboCallLayerParent.scrollTop + comboCall.getBoundingClientRect().top : 0;

    let fullpop_contlow_top = 0;
    let combo_left = comboCall.getBoundingClientRect().left;
    let fullpop_contlow_left = 0;


    if (comboCall.closest(".popup_content_low") !== null) {
        fullpop_contlow_top = comboCall.closest(".popup_content_low").getBoundingClientRect().top;
        fullpop_contlow_left = comboCall.closest(".popup_content_low").getBoundingClientRect().left;
        appendOption.setAttribute("style", `
            top : ${(combo_layer_top - fullpop_contlow_top) + comboCall.getBoundingClientRect().height - 1}px; 
            left : ${combo_left - fullpop_contlow_left}px;
            width : ${ comboCall.getBoundingClientRect().width }px;
        `)
      } else {
       
      if(appendOption.classList.contains("reverse_pos")){
        appendOption.setAttribute("style", `
        top : ${combo_top+0.5}px; 
        left : ${combo_left+window.scrollX}px;
          width : ${ comboCall.getBoundingClientRect().width }px;
      `)
      }else{
        appendOption.setAttribute("style", `
          top : ${combo_top + comboCall.getBoundingClientRect().height - 1}px; 
          left : ${combo_left+window.scrollX}px;
          width : ${ comboCall.getBoundingClientRect().width }px;
      `)
      }
    }
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

function formItemFunc(){
  addDynamicEventListener(document.body, 'focusin', '.input_component_box .input_origin_item', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    if(thisTargetParent.classList.contains("filled")){
      thisTargetParent.classList.add("focus");
    }
  });
  addDynamicEventListener(document.body, 'input', '.input_component_box .input_origin_item', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    console.log('input',thisTarget.value.length)
    if(thisTarget.value.length){
      thisTargetParent.classList.add("filled");
    }
  });
  addDynamicEventListener(document.body, 'focusout', '.input_component_box .input_origin_item', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    thisTargetParent.classList.remove("focus");
    if(thisTarget.value.length ===0){
      thisTargetParent.classList.remove("filled");
    }
   
  });
  addDynamicEventListener(document.body, 'mousedown','.btn_form_reset', function(e) {
    const thisTarget = e.target;
    const thisTargetParent = thisTarget.closest(".input_component_box");
    const thisTargetInput = thisTargetParent.querySelector(".input_origin_item");
    const thisTargetSearchParent = thisTarget.closest(".search_field_wrap");
    thisTargetInput.value = '';
    thisTargetParent.classList.remove("focus");
    thisTargetParent.classList.remove("warn");

    if(!!thisTargetSearchParent){
      thisTargetSearchParent.classList.remove("value_true");
      document.querySelector(`[data-autoLayer='${thisTargetSearchParent.getAttribute("id")}']`).classList.remove("auto_mode");
    }
  });
}


/* bottom toggle */
function bottomFoldFunc(){
  const btn_map_fold_control = document.querySelector(".btn_map_fold_control");
  const map_fold_content_row = document.querySelector(".map_fold_content_row");
  const map_fold_content = document.querySelector(".map_fold_content");
  let map_fold_content_height = 0;
  if(!btn_map_fold_control){return;}
  let fold_boolean = !!btn_map_fold_control ? btn_map_fold_control.classList.contains("fold") : false;
  btn_map_fold_control.addEventListener("click",(e)=>{
    e.preventDefault();
    const thisTarget = e.currentTarget;
    thisTarget.classList.toggle("fold");
    fold_boolean = !fold_boolean;
    map_fold_content_height = map_fold_content.getBoundingClientRect().height;
    if(fold_boolean){
      setTimeout(()=>{
        map_fold_content_row.style.height = map_fold_content_height + "px";
      },20);
    }else{
      map_fold_content_row.style.height = "2px";
    }
  });
}


/* popup */

/**
 * 디자인 팝업
 * @param {*} option 
 */
function DesignPopup(option) {
  this.option = option;
  this.selector = this.option.selector;

  if (this.selector !== undefined) {
    this.selector = document.querySelector(this.option.selector);
  }
  this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.layer_wrap_parent = null;
  this.btn_closeTrigger = null;
  this.btn_close = null;
  this.bg_design_popup = null;
  this.scrollValue = 0;

  this.btn_closeTrigger = null;
  this.btn_close = null;

  const popupGroupCreate = document.createElement("div");
  popupGroupCreate.classList.add("layer_wrap_parent");

  if(!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")){
    this.domBody.append(popupGroupCreate);
  }

  this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

  

  // console.log(this.selector.querySelectorAll(".close_trigger"));



  this.bindEvent();
}



DesignPopup.prototype.dimCheck = function(){
  const popupActive = document.querySelectorAll(".popup_wrap.active");
  if(!!popupActive[0]){
    popupActive[0].classList.add("active_first");
  }
  if(popupActive.length>1){
    this.layer_wrap_parent.classList.add("has_active_multi");
  }else{
    this.layer_wrap_parent.classList.remove("has_active_multi");
  }
}
DesignPopup.prototype.popupShow = function () {
  this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");

  if (this.selector == null) {
    return;
  }
  // this.domHtml.classList.add("touchDis");
  
  this.selector.classList.add("active");
  setTimeout(()=>{
    this.selector.classList.add("motion_end");
  },30);
  if ("beforeCallback" in this.option) {
    this.option.beforeCallback();
  }

  if ("callback" in this.option) {
    this.option.callback();
  }
  if(!!this.design_popup_wrap_active){
    this.design_popup_wrap_active.forEach((element,index)=>{
      if(this.design_popup_wrap_active !== this.selector){
        element.classList.remove("active");
      }
    })
  }
  //animateIng = true;

  this.layer_wrap_parent.append(this.selector);
  

  this.dimCheck();

  // this.layer_wrap_parent

  // ****** 주소 해시 설정 ****** //
  // location.hash = this.selector.id
  // modalCount++
  // modalHash[modalCount] = '#' + this.selector.id
}
DesignPopup.prototype.popupHide = function () {
  var target = this.option.selector;
  if (target !== undefined) {

    this.selector.classList.remove("motion");
    if ("beforeClose" in this.option) {
      this.option.beforeClose();
    }
     //remove
     this.selector.classList.remove("motion_end");
     setTimeout(()=>{

       this.selector.classList.remove("active");
     },400)
     this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
     this.dimCheck();
     if ("closeCallback" in this.option) {
       this.option.closeCallback();
     }
    //  if (this.design_popup_wrap_active.length == 0) {
    //    this.domHtml.classList.remove("touchDis");
    //  }
  }
}

DesignPopup.prototype.bindEvent = function () {
  this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
  this.bg_design_popup = this.selector.querySelector(".bg_dim");
  var closeItemArray = [...this.btn_close];

  // this.selector.querySelector(".popup_content_low").addEventListener("scroll",(e)=>{
  //   console.log(this.selector.querySelector(".popup_content_low").scrollTop)
  // });

  if(!!this.btn_closeTrigger){
    this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
    closeItemArray.push(...this.btn_closeTrigger)
  }
  if (!!this.bg_design_popup) {
    closeItemArray.push(this.bg_design_popup);
  }
  if (closeItemArray.length) {
    closeItemArray.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        this.popupHide(this.selector);
      }, false);
    });
  }
};


/* ui_picker_render */
function uiPickerRender(){
  const ui_picker_render = document.querySelectorAll(".ui_picker_render");
  const appBody = document.querySelector(".page_wrap");
  if(!ui_picker_render){return}

  init();

  actionPos();
  window.addEventListener("resize",()=>{
    actionPos()
  });

  function init(){
    ui_picker_render.forEach((render)=>{
      if(render.classList.contains("reverse_render")){
        return;
      }
      const thisSiblings = siblings(render);
      if(!render.classList.contains("reverse_render")){
        thisSiblings.forEach((callItem)=>{
          if(callItem.classList.contains("tui-datepicker-input")){
            callItem.setAttribute("data-calendarcall",render.getAttribute("id"));
          }
        });
      }
      if (render.closest(".popup_content_low") !== null) {
        render.closest(".popup_content_low").appendChild(render);
      } else {
        appBody.appendChild(render);
      }
    });
  }

  function actionPos(){
    ui_picker_render.forEach((render)=>{
      if(render.classList.contains("reverse_render")){
        return;
      }
      const renderLayerParent = render.closest(".popup_content_low");
      const calendarCall = document.querySelector(`[data-calendarcall='${render.getAttribute("id")}']`);
      let calendarCallLayerParentScrollTop = !!renderLayerParent ? renderLayerParent.scrollTop : 0;

      let call_top = window.scrollY + calendarCall.getBoundingClientRect().top + calendarCall.getBoundingClientRect().height;
      let calendar_layer_top = calendarCallLayerParentScrollTop + calendarCall.getBoundingClientRect().top;
      
      let fullpop_contlow_top = 0;
      let calendar_left = calendarCall.getBoundingClientRect().left;
      let fullpop_contlow_left = 0;

      if (!!render.closest(".popup_content_low")) {
        fullpop_contlow_top = renderLayerParent.getBoundingClientRect().top;
        fullpop_contlow_left = renderLayerParent.getBoundingClientRect().left;
        render.setAttribute("style", `
            top : ${(calendar_layer_top - fullpop_contlow_top) + calendarCall.getBoundingClientRect().height - 1}px; 
            left : ${calendar_left - fullpop_contlow_left}px;
            width : ${ calendarCall.getBoundingClientRect().width }px;
        `)
      } else {
        render.setAttribute("style", `
            top : ${call_top}px; 
            left : ${calendar_left}px;
              width : ${ calendarCall.getBoundingClientRect().width }px;
        `)
      }
     
    });
  }
}
/* 검색 */

/* search  */
function searchForm() {
  const auto_word_layer = document.querySelectorAll(".auto_word_layer");
  const auto_word_item = document.querySelectorAll(".auto_word_item");
  const searchFieldWrap = document.querySelectorAll(".search_field_wrap");
  const searchInput = document.querySelectorAll(".search_field_wrap .input_origin_item");
  let appendLayer = null;
  const appBody = document.querySelector(".page_wrap");
  if (searchInput.length) {
    searchInput.forEach((element, index) => {
      const eachElement = element;
      const eachElementParent = element.closest(".search_field_wrap");
      const eachElementReset = eachElementParent.querySelector(".btn_form_reset");
      const eachElementField = element.closest(".search_field");
      const eachElementLayer = eachElementParent.querySelector(".auto_word_layer");

      eachElement.addEventListener("focus", (e) => {
        searchFieldWrap.forEach((item)=>{
          resetLayer(item);
        });
        if (eachElementLayer !== null) {
          autoLayerInit(eachElementParent, eachElementLayer, index);
          autoLayerPos(eachElementParent);
        }
        if (eachElementField !== null) {
          eachElementField.classList.add("active");
        }
      });
      eachElement.addEventListener("input", (e) => {
        let thisEventObj = e.currentTarget;
        
        

        eachElementField.classList.add("typing");
        valueCheck(thisEventObj, eachElementParent);
      });
      eachElement.addEventListener("focusout", (e) => {
        let thisEventObj = e.currentTarget;
        eachElementField.classList.remove("typing");
        if (!!eachElementField) {
          eachElementField.classList.remove("active");
        }
        //valueCheck(thisEventObj, eachElementParent);
        //resetLayer(eachElementParent);
      });

      // eachElementReset.addEventListener("click", (e) => {
      //   let thisEventInputObj = eachElementParent.querySelector(".input_origin_item");
      //   thisEventInputObj.value = "";
      //   eachElementParent.classList.remove("value_true");
      //   document.querySelector(`[data-autoLayer='${eachElementParent.getAttribute("id")}']`).classList.remove("auto_mode");
      // });
    });

    if(auto_word_item.length){
      auto_word_item.forEach((element) => {
        element.addEventListener("click", (e) => {
          let thisEventObj = e.currentTarget;
          let thisEventParentLayer = thisEventObj.closest(".auto_word_layer");
          let thisEventParentCall = document.querySelector(`[id='${thisEventParentLayer.getAttribute("data-autolayer")}']`);
          let thisEventParentCallInput = thisEventParentCall.querySelector(".input_origin_item");
          
          if (thisEventObj.classList.contains("disabled")) { return; }
          thisEventParentCallInput.value = thisEventObj.textContent;
          thisEventParentLayer.classList.remove("auto_mode");
        });
      });
    }

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".search_field_wrap") !== null || e.target.closest(".auto_word_layer") !== null) {
        return;
      }
      auto_word_layer.forEach((element) => {
        element.classList.remove("auto_mode");
      });
    });

    window.addEventListener("resize", () => {
      resizePos();
    });


    function autoLayerInit(target, layer, index) {
      let thisElement = target;
      let auto_word_layer = layer;

      if (thisElement.getAttribute("id") === null) {
        thisElement.setAttribute("id", 'search_item_' + index);
        auto_word_layer.setAttribute("data-autoLayer", 'search_item_' + index);
      } else {
        auto_word_layer.setAttribute("data-autoLayer", thisElement.getAttribute("id"));
      }
      if (thisElement.closest(".popup_content_low") !== null) {
        thisElement.closest(".popup_content_low").appendChild(auto_word_layer);
      } else {
        appBody.appendChild(auto_word_layer);
      }
    }

    function autoLayerPos(target) {
      const thisElement = target;
      appendLayer = document.querySelector(`[data-autoLayer='${thisElement.getAttribute("id")}']`);
      if (appendLayer === null) { return; }
      if (thisElement.closest(".popup_content_low") !== null) {
        // appendLayer.setAttribute("style", `
        //           top : ${(thisElement.getBoundingClientRect().top - thisElement.closest(".popup_content_low").getBoundingClientRect().top) + thisElement.getBoundingClientRect().height - 1}px;
        //           left : ${thisElement.getBoundingClientRect().left - thisElement.closest(".popup_content_low").getBoundingClientRect().left}px;
        //           width : ${thisElement.scrollWidth}px;
        // `)
        const popupContentLow = thisElement.closest(".popup_content_low");
        const popupContentLowTop = popupContentLow.getBoundingClientRect().top;
        const autolayerInTop = popupContentLow.scrollTop + thisElement.getBoundingClientRect().top;
        appendLayer.setAttribute("style", `
          top : ${(autolayerInTop - popupContentLowTop) + thisElement.getBoundingClientRect().height}px;
          left : ${thisElement.getBoundingClientRect().left - thisElement.closest(".popup_content_low").getBoundingClientRect().left}px;
          width : ${thisElement.scrollWidth}px;
        `)
      } else {
        appendLayer.setAttribute("style", `
            top : ${window.scrollY + thisElement.getBoundingClientRect().top + thisElement.getBoundingClientRect().height}px;
            left : ${thisElement.getBoundingClientRect().left}px;
            width : ${thisElement.scrollWidth}px;
        `)
      }
    }

    function resizePos() {
      searchFieldWrap.forEach((element, index) => {
        autoLayerPos(element);
      })
    }
  }
  function valueCheck(target, parent) {
    const thisElement = target;
    const thisElementParent = parent;
    if(appendLayer === null){return;}
    appendLayer = document.querySelector(`[data-autoLayer='${thisElementParent.getAttribute("id")}']`);
    let auto_word_list_wrap = appendLayer.querySelector(".auto_word_list_wrap");
    let autoLayerCountOption = thisElementParent.getAttribute("data-rowCount") !== undefined ? thisElementParent.getAttribute("data-rowCount") : 3;
    if (thisElement.value.length) {
      thisElementParent.classList.add("value_true");
      appendLayer.classList.add("auto_mode");
      if (!!appendLayer.querySelectorAll("li")[autoLayerCountOption]) {
        auto_word_list_wrap.style.maxHeight = `${appendLayer.querySelectorAll("li")[autoLayerCountOption].offsetTop}px`;
      }
      appendLayer.classList.add("auto_scroll_show");
    } else {
      resetLayer(thisElementParent);
    }
  }

  function resetLayer(parent){
    parent.classList.remove("value_true");
    parent.classList.remove("typing");
    if(!!appendLayer){
      appendLayer.classList.remove("auto_mode");
      appendLayer.classList.remove("auto_scroll_show");
    }
  }
}


/**
 * 디자인 모달
 * @param {*} option 
 */
 function DesignModal(option) {
  this.title = option.title;
  this.message = option.message;
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.design_modal_wrap = null;
  this.btn_dmsmidentify = null;
  this.btn_dmsmcancel = null;
  this.duration = option.duration !== undefined ? option.duration : 400;
  this.initShow(option);
}
  
DesignModal.prototype.initShow = function (option) {
  var innerPublish = '';
  var objThis = this;
  let confirmPublish = option.type === "confirm" ? `<a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>취소</a>` : ``;
  /* 
  innerPublish += "<div class='design_modal_wrap'>";
  innerPublish += "  <div class='bg_design_modal'></div>";
  innerPublish += "  <div class='design_modal_w'>";
  innerPublish += "          <div class='design_modal'>";

  innerPublish += "              <div class='design_modal_cont_w'><div class='design_modal_text'></div></div>";
  innerPublish += "              <div class='btn_dmsm_wrap'>";
  if (option.type === "confirm") {
    innerPublish += "              <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>취소</a>";
  }
  innerPublish += "                  <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>";
  innerPublish += "              </div>";
  innerPublish += "          </div>";
  innerPublish += "  </div>";
  innerPublish += "</div>";
 */
  innerPublish = `
  <div class='design_modal_wrap'>
    <div class='design_modal_tb'>
      <div class='design_modal_td'>
        <div class='bg_design_modal'></div>
        <div class='design_modal'>
          <div class='design_modal_cont_w'>
            <div class='design_modal_maintext'></div>
            <div class='design_modal_subtext'></div>
          </div>
          <div class='btn_dmsm_wrap'>
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmclose'>닫기</a>
          ${confirmPublish}
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>
          </div>
          <a href='javascript:;' class='btn_modal_close'><span class='hdtext'>닫기</span></a>
        </div>
      </div>
    </div>
  </div>
  `;

  
  this.modalparent = document.createElement('div');
  this.pagewrap.appendChild(this.modalparent);
  this.modalparent.classList.add("design_modal_insert_wrap");
  this.modalparent.innerHTML = innerPublish;
  this.closetrigger = document.querySelectorAll(".close_dmtrigger");
  this.design_modal_wrap = document.querySelector(".design_modal_wrap");
  this.btn_modal_close = document.querySelector(".btn_modal_close");

  if (option.type === "confirm" || option.type === "alert") {
    this.design_modal_tit = document.querySelector(".design_modal_tit");
    this.design_modal_text = document.querySelector(".design_modal_maintext");
    this.design_modal_subtext = document.querySelector(".design_modal_subtext");
    this.btn_dmsmidentify = document.querySelector(".btn_dmsmidentify");
    this.design_modal_text.innerHTML = option.main_message;
    this.design_modal_subtext.innerHTML = option.sub_message;
    
  }
  if (option.type === "confirm") {
    this.btn_dmsmcancel = document.querySelector(".btn_dmsmcancel");
  }
  if (option.type === "title") {
    this.design_modal_tit.innerHTML = option.title;
  }
  
  this.bindEvent(option);
}
DesignModal.prototype.show = function () {
  this.pagewrap.style.zIndex = 0;
  this.domHtml.classList.add("touchDis");
  
  
  this.design_modal_wrap.classList.add("active");
  setTimeout(()=>{
    this.design_modal_wrap.classList.add("motion");
  }, 30);
}
DesignModal.prototype.hide = function () {
  var objThis = this;
  this.design_modal_wrap.classList.remove("motion");
  setTimeout(function () {
    objThis.design_modal_wrap.classList.remove("active");
    document.querySelector(".design_modal_insert_wrap").remove();
    objThis.design_modal_wrap.remove();
    objThis.domHtml.classList.remove("touchDis");
  }, 530);
}
DesignModal.prototype.bindEvent = function (option) {
  var objThis = this;
  let btn_close_item = [this.btn_modal_close, ...this.closetrigger];
  btn_close_item.forEach((element,index)=>{
    element.addEventListener("click", function () {
      objThis.hide();
    }, false);
  })
  if (this.btn_dmsmidentify !== null) {
    this.btn_dmsmidentify.addEventListener("click", function () {
      if (option.identify_callback !== undefined) {
        option.identify_callback();
      }
    }, false);
  }
  if (this.btn_dmsmcancel !== null) {
    this.btn_dmsmcancel.addEventListener("click", function () {
      if (option.cancel_callback !== undefined) {
        option.cancel_callback();
      }
    }, false);
  }
}


/* tooltip */
function tooltipFunc(){
  const tooltipCall = document.querySelectorAll("[data-tooltip]");
  const tooltipWrap = document.querySelectorAll(".tooltip_wrap");
  let tooltopMargin = 10;
  let tooltipActive = null;
  let barwidth = getScrollBarWidth();
  

  if(!tooltipCall || !tooltipWrap){return}

  tooltipCall.forEach((item)=>{
    let activeBoolean = false;
    item.addEventListener("click",(e)=>{
      e.preventDefault();
      const thisTarget = e.currentTarget;
      const thisTargetLayer = document.querySelector(thisTarget.getAttribute("data-tooltip"));
      if(!!thisTargetLayer){
        if(tooltipActive && thisTargetLayer !== tooltipActive){
          tooltipActive.classList.remove("check_active","active");
        }
        thisTargetLayer.classList.toggle("check_active");
        if(thisTargetLayer.classList.contains("check_active")){
          thisTargetLayer.classList.add("active");
          tooltipActive = thisTargetLayer;
          posAction();
          setTimeout(()=>{
            thisTargetLayer.classList.add("posend");
          },30);
        }else{
          thisTargetLayer.classList.remove("posend");
          setTimeout(()=>{
            thisTargetLayer.classList.remove("active");
          },430);
        }
      }
    });
  });

  window.addEventListener("resize",()=>{
    posAction();
  });
  document.addEventListener("click",(e)=>{
    if(!document.querySelector(e.target.getAttribute("data-tooltip")) && tooltipActive){
      tooltipActive.classList.remove("check_active","posend");
      setTimeout(()=>{
        tooltipActive.classList.remove("active");
      },430);
    }
  });

  function posAction(){
    
    let windowInnerWidth = window.innerWidth - barwidth;
    let windowInnerHeight = window.innerHeight - barwidth;

    let topValue = 0;
    let leftValue = 0;

    if(!tooltipActive){return;}

    
    const callItem = document.querySelector("[data-tooltip='#"+tooltipActive.getAttribute("id")+"']");
    tooltipActive.classList.remove("right_end", "left_end");
    tooltipActive.removeAttribute("style");


    // default
    topValue = window.scrollY + callItem.getBoundingClientRect().top + callItem.getBoundingClientRect().height + tooltopMargin; 
    leftValue = callItem.getBoundingClientRect().left - (tooltipActive.getBoundingClientRect().width/2 - callItem.getBoundingClientRect().width/2);
    tooltipActive.setAttribute("style", `
        top : ${topValue}px;
        left : ${leftValue}px;
    `)

    // else
    if(tooltipActive.getBoundingClientRect().right >= windowInnerWidth){
      tooltipActive.classList.add("right_end");
    }
    if(tooltipActive.getBoundingClientRect().left < 0){
      tooltipActive.classList.add("left_end");
    }
    if(tooltipActive.getBoundingClientRect().bottom >= windowInnerHeight){
      topValue = window.scrollY + callItem.getBoundingClientRect().top - tooltipActive.getBoundingClientRect().height - tooltopMargin; 
    }
    tooltipActive.setAttribute("style", `
        top : ${topValue}px;
        left : ${leftValue}px;
    `)
  }
}


/* scroll bar */
function getScrollBarWidth() {
  let el = document.createElement("div");
  el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
  document.body.appendChild(el);
  let width = el.offsetWidth - el.clientWidth;
  el.remove();
  return width;
}


/* local layer */

function localLayer(callback){
  const localTarget = document.querySelectorAll("[data-localpopup]");
  let activeLayer = document.querySelector(".local_layer.active");

  console.log(localTarget);
  if(!!localTarget){
    localTarget.forEach((item)=>{
      item.addEventListener("click",(e)=>{
        e.preventDefault();
        const thisCall = e.currentTarget;
        const thisTarget = document.querySelector(thisCall.getAttribute("data-localpopup")) ?? null;
        const thisTargetParent = document.querySelector(thisCall.getAttribute("data-localParent")) ?? null;
        if(!!thisTarget){
          console.log(thisCall.getBoundingClientRect().top,thisTargetParent.getBoundingClientRect().top);
          thisTarget.style.top = (thisCall.getBoundingClientRect().top-thisTargetParent.getBoundingClientRect().top)+thisCall.getBoundingClientRect().height+4 + 'px';
         thisTarget.classList.toggle("active");
         if(thisTarget.classList.contains("active")){
          window.dispatchEvent(new Event('resize'));
          activeLayer = thisTarget;
          if(callback){
            callback();
          }
         }
        }
      });
    });
    document.querySelector("body").addEventListener("click",(e)=>{
      if(e.target.closest(".local_layer") || e.target.getAttribute("data-localpopup") || e.target.closest("[data-localpopup]") || e.target.closest(".ui_picker_render")){
        return;
      }
      if(!!activeLayer){
        activeLayer.classList.remove("active");
      }
    });
  }
}