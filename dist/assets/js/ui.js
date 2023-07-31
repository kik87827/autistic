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
  let header_height = 0;
  const footer_wrap = document.querySelector(".footer_wrap");
  let footer_height = 0;
  const middle_wrap = document.querySelector(".middle_wrap");
  const middle_left_item = document.querySelector(".middle_left_item");
  let middle_left_item_pos = 0;
  const btn_topmenu = document.querySelector(".btn_topmenu");
  const btn_header_menu_close = document.querySelector(".btn_header_menu_close");
  const header_menu_dialogue = document.querySelector(".header_menu_dialogue");

  const domHtml = document.querySelector("html");
  const domBody = document.querySelector("body");
  const btn_gotop = document.querySelector(".btn_gotop");

  const footer_menu = document.querySelectorAll(".footer_menu");


  if (btn_gotop !== null) {
    btn_gotop.addEventListener("click", (e) => {
      e.preventDefault();
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 30);
    });
  }

  if (!!footer_menu) {
    footer_menu.forEach((item) => {
      item.addEventListener("touchstart", (e) => {
        e.currentTarget.classList.add("touchhover");
      });
      item.addEventListener("touchend", (e) => {
        const etarget = e.currentTarget;
        setTimeout(function() {
          etarget.classList.remove("touchhover");
        }, 100);
      });
    });
  }


  setHeight();

  window.addEventListener("scroll", () => {
    if (btn_gotop !== null) {
      if (scrollY > 0) {
        btn_gotop.classList.add("active");
      } else {
        btn_gotop.classList.remove("active");
      }
    }
    setLeft();
  })

  window.addEventListener("resize", () => {
    setHeight();
  })

  if (!!btn_topmenu && !!header_menu_dialogue) {
    btn_topmenu.addEventListener("click", (e) => {
      e.preventDefault();
      gnbOpen();
      // setTimeout(()=>{
      //   header_menu_dialogue.classList.add("motion");
      // },20);
    });
  }

  if (!!btn_header_menu_close) {
    btn_header_menu_close.addEventListener("click", (e) => {
      e.preventDefault();
      gnbClose();
      // setTimeout(()=>{
      //   header_menu_dialogue.classList.remove("active");
      // },320);
    });
  }

  function gnbOpen() {
    domHtml.classList.add("touchDis");
    header_menu_dialogue.classList.add("active");
  }

  function gnbClose() {
    domHtml.classList.remove("touchDis");
    header_menu_dialogue.classList.remove("active");
  }

  function setHeight() {
    if (!middle_wrap) {
      return;
    }
    header_height = !!header_wrap ? header_wrap.getBoundingClientRect().height : 0;
    footer_height = !!footer_wrap ? footer_wrap.getBoundingClientRect().height : 0;
    middle_wrap.style.minHeight = `${window.innerHeight - (header_height + footer_height)}px`
  }

  function setLeft() {
    if (!middle_left_item) {
      return;
    }
    middle_left_item_pos = !!middle_left_item ? middle_left_item.getBoundingClientRect().top : 0;
    if (window.scrollY > middle_left_item_pos) {
      middle_left_item.classList.add("sticky");
      middle_left_item.style.top = `${header_height + 30}px`;
    } else {
      middle_left_item.classList.remove("sticky");
      middle_left_item.style.top = `0px`;
    }
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

DesignModal.prototype.initShow = function(option) {
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
DesignModal.prototype.show = function() {
  this.pagewrap.style.zIndex = 0;
  this.domHtml.classList.add("touchDis");


  this.design_modal_wrap.classList.add("active");
  setTimeout(() => {
    this.design_modal_wrap.classList.add("motion");
  }, 30);
}
DesignModal.prototype.hide = function() {
  var objThis = this;
  this.design_modal_wrap.classList.remove("motion");
  setTimeout(function() {
    objThis.design_modal_wrap.classList.remove("active");
    document.querySelector(".design_modal_insert_wrap").remove();
    objThis.design_modal_wrap.remove();
    objThis.domHtml.classList.remove("touchDis");
  }, 530);
}
DesignModal.prototype.bindEvent = function(option) {
  var objThis = this;
  let btn_close_item = [this.btn_modal_close, ...this.closetrigger];
  btn_close_item.forEach((element, index) => {
    element.addEventListener("click", function() {
      objThis.hide();
    }, false);
  })
  if (this.btn_dmsmidentify !== null) {
    this.btn_dmsmidentify.addEventListener("click", function() {
      if (option.identify_callback !== undefined) {
        option.identify_callback();
      }
    }, false);
  }
  if (this.btn_dmsmcancel !== null) {
    this.btn_dmsmcancel.addEventListener("click", function() {
      if (option.cancel_callback !== undefined) {
        option.cancel_callback();
      }
    }, false);
  }
}


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

  const popupGroupCreate = document.createElement("div");
  popupGroupCreate.classList.add("layer_wrap_parent");

  if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
    this.domBody.append(popupGroupCreate);
  }

  this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");



  // console.log(this.selector.querySelectorAll(".close_trigger"));



  this.bindEvent();
}



DesignPopup.prototype.dimCheck = function() {
  const popupActive = document.querySelectorAll(".popup_wrap.active");
  if (!!popupActive[0]) {
    popupActive[0].classList.add("active_first");
  }
  if (popupActive.length > 1) {
    this.layer_wrap_parent.classList.add("has_active_multi");
  } else {
    this.layer_wrap_parent.classList.remove("has_active_multi");
  }
}
DesignPopup.prototype.popupShow = function() {
  var touchstart = "ontouchstart" in window;
  this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
  let animateIng = 0;

  if (this.selector == null) {
    return;
  }
  if (animateIng > 1) {
    return;
  }
  if (touchstart) {
    //this.domBody.setAttribute("data-scr", window.scrollY);
    //this.domBody.style.marginTop = -window.scrollY + "px";
    this.scrollValue = window.scrollY;
    this.domHtml.classList.add("touchDis");
  }

  this.selector.classList.add("active");
  if ("beforeCallback" in this.option) {
    this.option.beforeCallback();
  }

  animateIng++;
  setTimeout(() => {
    this.selector.classList.add("motion");

    if ("callback" in this.option) {
      this.option.callback();
    }
  }, 400);
  if (!!this.design_popup_wrap_active) {
    this.design_popup_wrap_active.forEach((element, index) => {
      if (this.design_popup_wrap_active !== this.selector) {
        element.classList.remove("motion");
        setTimeout(() => {
          element.classList.remove("active");
        }, 420);
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
DesignPopup.prototype.popupHide = function() {
  var target = this.option.selector;
  var touchstart = "ontouchstart" in window;
  var motionTime = 0;
  if (target !== undefined) {

    this.selector.classList.remove("motion");
    if ("beforeClose" in this.option) {
      this.option.beforeClose();
    }

    if (motionTime) {
      clearTimeout(motionTime);
      motionTime = 0;
    }
    motionTime = setTimeout(() => {
      //remove
      this.selector.classList.remove("active");
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();
      if ("closeCallback" in this.option) {
        this.option.closeCallback();
      }
      if (this.design_popup_wrap_active.length == 0 && touchstart) {
        this.domHtml.classList.remove("touchDis");
        this.domBody.style.marginTop = 0;
        //window.scrollTo(0, parseInt(this.domBody.getAttribute("data-scr")));
      }
    }, 420);
  }
}

DesignPopup.prototype.bindEvent = function() {
  this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger,.btn_closeitem");
  this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
  this.bg_design_popup = this.selector.querySelector(".bg_dim");

  var closeItemArray = [...this.btn_closeTrigger, ...this.btn_close];

  if (this.bg_design_popup !== null) {
    closeItemArray.push(this.bg_design_popup);
  }
  if (closeItemArray.length) {
    closeItemArray.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        this.popupHide(this.selector);
        // history.back()
        // modalCount--
      }, false);
    });
  }
};


/**
 * cookie
 */
function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}


/** 
 * 
 */
function swiperTable() {
  const swiper_table = document.querySelectorAll(".swiper-drag-wrap");
  if (swiper_table.length) {
    swiper_table.forEach((swiperGroup, index) => {
      const thisSwiperGroup = swiperGroup;
      const thisSwiperSlide = thisSwiperGroup.querySelectorAll(".swiper-slide");
      swiperGroup.setAttribute("id", "swiper0" + (index + 1));
      if (thisSwiperSlide.length) {
        (new Function(
          `
        ${swiperGroup.getAttribute("id")} = new Swiper("#${swiperGroup.getAttribute("id")}", {
          slidesPerView: "auto",
          freeMode: true,
          touchRatio: 0,
          breakpoints : {
            768 : {
              touchRatio: 1
            }
          },
          scrollbar : {
            el: "#${swiperGroup.getAttribute("id")} .swiper-scrollbar"
          }
        });
      `
        )());
      }
    });
  }
}


/**
 * 
 */
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
    appendOptionListOption = combo_option_scroll.getAttribute("data-rowCount") !== undefined ? combo_option_scroll.getAttribute("data-rowCount") : 5;
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
        combo_option_scroll.style.maxHeight = `${appendOption.querySelectorAll("li")[appendOptionListOption].offsetTop+7}px`;
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


/* step respon */
function stepResponFunc(option) {
  action();
  window.addEventListener("resize", () => {
    action();
  });

  function action() {
    let stepText = [];
    let stepIcon = [];
    if (window.innerWidth >= 768) {
      stepIcon = option.thum_pc;
      stepText = option.text_pc;
    } else {
      stepIcon = option.thum_mobile;
      stepText = option.text_mobile;
    }
    if (!!option.target) {
      document.querySelectorAll(option.target).forEach((target) => {
        target.querySelectorAll(".img_step_thum").forEach((thum, index) => {
          if (Array.from(thum.classList).length > 1) {
            thum.classList.remove(Array.from(thum.classList)[1]);
          }
          thum.classList.add(stepIcon[index])
        })
        target.querySelectorAll(".img_step_text").forEach((textDom, index) => {
          textDom.innerHTML = stepText[index];
        })
      })
    }
  }
}


/* search  */
function searchForm() {
  const auto_word_layer = document.querySelectorAll(".auto_word_layer");
  const auto_word_item = document.querySelectorAll(".auto_word_item");
  const searchFieldWrap = document.querySelectorAll(".search_field_wrap");
  const searchInput = document.querySelectorAll(".search_field_wrap .form_input");
  let appendLayer = null;
  const appBody = document.querySelector(".page_wrap");
  if (searchInput.length) {
    searchInput.forEach((element, index) => {
      const eachElement = element;
      const eachElementParent = element.closest(".search_field_wrap");
      const eachElementField = element.closest(".search_field");
      const eachElementLayer = eachElementParent.querySelector(".auto_word_layer");

      eachElement.addEventListener("focus", (e) => {
        searchFieldWrap.forEach((item) => {
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
      //   let thisEventInputObj = eachElementParent.querySelector(".form_input");
      //   thisEventInputObj.value = "";
      //   eachElementParent.classList.remove("value_true");
      //   if (eachElementParent.getAttribute("data-autoLayer") == "true") {
      //     document.querySelector(`[data-autoLayer='${eachElementParent.getAttribute("id")}']`).classList.remove("auto_mode");
      //   }
      // });
    });

    if (auto_word_item.length) {
      auto_word_item.forEach((element) => {
        element.addEventListener("click", (e) => {
          let thisEventObj = e.currentTarget;
          let thisEventParentLayer = thisEventObj.closest(".auto_word_layer");
          let thisEventParentCall = document.querySelector(`[id='${thisEventParentLayer.getAttribute("data-autolayer")}']`);
          let thisEventParentCallInput = thisEventParentCall.querySelector(".form_input");

          if (thisEventObj.classList.contains("disabled")) {
            return;
          }
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
      if (thisElement.closest(".popup_contentlow") !== null) {
        thisElement.closest(".popup_contentlow").appendChild(auto_word_layer);
      } else {
        appBody.appendChild(auto_word_layer);
      }
    }

    function autoLayerPos(target) {
      const thisElement = target;
      appendLayer = document.querySelector(`[data-autoLayer='${thisElement.getAttribute("id")}']`);
      if (appendLayer === null) {
        return;
      }
      if (thisElement.closest(".popup_contentlow") !== null) {
        appendLayer.setAttribute("style", `
                  top : ${(thisElement.getBoundingClientRect().top - thisElement.closest(".popup_contentlow").getBoundingClientRect().top) + thisElement.getBoundingClientRect().height - 1}px;
                  left : ${thisElement.getBoundingClientRect().left - thisElement.closest(".popup_contentlow").getBoundingClientRect().left}px;
                  width : ${thisElement.scrollWidth}px;
              `)
      } else {
        appendLayer.setAttribute("style", `
                  top : ${window.scrollY + thisElement.getBoundingClientRect().top + thisElement.getBoundingClientRect().height - 1}px;
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
    if (appendLayer === null) {
      return;
    }
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

  function resetLayer(parent) {
    parent.classList.remove("value_true");
    parent.classList.remove("typing");
    if (!!appendLayer) {
      appendLayer.classList.remove("auto_mode");
      appendLayer.classList.remove("auto_scroll_show");
    }
  }
}


function mbDateCall() {
  const input_calendar_mb = document.querySelectorAll(".input_calendar_mb");
  if (!!input_calendar_mb) {
    Array.from(input_calendar_mb).forEach((item) => {
      checkValue();
      item.addEventListener("click", () => {
        item.closest(".input_calendar_mb_wrap").classList.add("active");
      })
      item.addEventListener("focusout", checkValue)
      item.addEventListener("change", checkValue)

      function checkValue() {
        if (item.value.length > 0) {
          item.closest(".input_calendar_mb_wrap").classList.add("active");
        } else {
          item.closest(".input_calendar_mb_wrap").classList.remove("active");
        }
        const pcCalendar = item.closest(".has_calendar").querySelector(".pc_fitem .input_calendar");
        if (!!pcCalendar) {
          pcCalendar.value = item.value.split("T").join(" ");
        }
      }
    })
  }

}


/**
 * form
 */
function searchBox() {
  const search_box = document.querySelectorAll(".search_box");
  if (!search_box) {
    return;
  }
  search_box.forEach((item) => {
    const form_input = item.querySelector(".form_input");
    if (!!form_input) {
      console.log('1');
      form_input.addEventListener("focus", () => {
        item.classList.add("focus");
      });
      form_input.addEventListener("focusout", () => {
        item.classList.remove("focus");
      });
    }
  });
}