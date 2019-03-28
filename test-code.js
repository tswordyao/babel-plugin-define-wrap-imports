(function(){
    var PAGE_WITH = 1205;
    var checkedPng = '//edu-image.nosdn.127.net/component-video-player-images-yixuan_f5257b30a4c00af84970a2d97c793887.png';
    var uncheckedPng = '//edu-image.nosdn.127.net/component-video-player-images-weixuan_9e07581dd41184c6dd3e114c4889394a.png';
    
    function genPages(start, pages, items) {
        if (items.length) {
            genPages(start + 1, pages, items);
        }
    }
  
    function normalizeComponent(template, createInjectorShadow) {
      var hook;
      if (moduleIdentifier) {
        options._ssrRegister = hook;
      } 
      return script;
    }
  
    var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  
    function createInjector(context) {
      return function (id, style) {
        return addStyle(id, style);
      };
    }
  var count = 0;
  var util = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"gift-pages"},[_c('p',{staticClass:"gift-pages-title"},[_vm._v("福利相送，任选3项免费领取")]),_vm._v(" "),_c('p',{staticClass:"gift-pages-desc"},[_vm._v("每个用户限领1次，认真选择了兴趣标签，推荐会更精准")]),_vm._v(" "),_c('p',{staticClass:"intrest-btn-wrap"},[_c('span',{staticClass:"intrest-btn",on:{"click":_vm.showInterest}},[_vm._v("选择兴趣标签 "),_c('span',{staticClass:"arrow-char"},[_vm._v(">")])])]),_vm._v(" "),_c('div',{staticClass:"gift-pages-wrap"},[_c('ul',{staticClass:"gift-pages-long",style:({left:_vm.scrollLeft,width:_vm.longWidth})},_vm._l((_vm.pages),function(page,index){return _c('li',{key:index,staticClass:"gift-pages-profile"},[_c('ul',_vm._l((page),function(item,i){return _c('li',{key:i,staticClass:"gift-pages-item"},[_c('a',{attrs:{"href":item.url,"target":"_blank"}},[_c('img',{staticClass:"gift-pages-item-img",attrs:{"src":item.imageUrl,"alt":""}}),_vm._v(" "),_c('p',{staticClass:"gift-pages-item-name"},[_vm._v(_vm._s(item.productName))])]),_vm._v(" "),_c('p',{staticClass:"pr"},[_c('span',{staticClass:"gift-pages-item-price"},[_vm._v(_vm._s(item.price? ('￥'+item.price):''))]),_vm._v(" "),(item.enrollFlag)?_c('span',{staticClass:"gift-pages-item-has-enroll"},[_vm._v("已参加")]):_c('img',{staticClass:"check-box-png",class:{checkedCur:item.checked},attrs:{"src":item.checked?_vm.checkedPng:_vm.uncheckedPng},on:{"click":function($event){return _vm.updateItem(item)}}})])])}),0)])}),0),_vm._v(" "),_c('img',{staticStyle:{"display":"none"},attrs:{"src":_vm.checkedPng}})]),_vm._v(" "),(_vm.currentPage!==0)?_c('span',{staticClass:"pre-btn",on:{"click":function($event){return _vm.toPre()}}},[_vm._v("<")]):_vm._e(),_vm._v(" "),(_vm.currentPage!==_vm.pages.length-1)?_c('span',{staticClass:"next-btn",on:{"click":function($event){return _vm.toNext()}}},[_vm._v(">")]):_vm._e(),_vm._v(" "),_c('p',{staticClass:"receive-btn-wrap"},[(_vm.checkedItems.length)?_c('span',{staticClass:"receive-btn",on:{"click":_vm.doReceive}},[_vm._v("立即免费领取（ "+_vm._s(_vm.checkedItems.length)+" ）")]):_c('span',{staticClass:"receive-btn disabled",on:{"click":_vm.doReceive}},[_vm._v("立即免费领取")])])])};
  
    var trans = function trans(Comp, nejModules) {
  
      var CompFac = function CompFac(ops) {
        ops.data && comp.setState(ops.data);
        return comp;
      };
  
      return CompFac;
    };
  
    var nejModules;

    NEJ.define([
      'lib/a',
      'lib/b',
      'lib/c'
    ],function(util,cache,c,dos){
        var  count = 5 ;
        var nejModules;
        util(cache.c.dos,c,dos)
        return trans(Comp$1, nejModules);
    });
  
  
  })()