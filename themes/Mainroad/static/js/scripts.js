/* Responsive-nav 1.0.39 */
!function(a,b,c){"use strict";var d=function(d,e){var f=!!b.getComputedStyle;f||(b.getComputedStyle=function(a){return this.el=a,this.getPropertyValue=function(b){var c=/(\-([a-z]){1})/g;return"float"===b&&(b="styleFloat"),c.test(b)&&(b=b.replace(c,function(){return arguments[2].toUpperCase()})),a.currentStyle[b]?a.currentStyle[b]:null},this});var g,h,i,j,k,l,m=function(a,b,c,d){if("addEventListener"in a)try{a.addEventListener(b,c,d)}catch(e){if("object"!=typeof c||!c.handleEvent)throw e;a.addEventListener(b,function(a){c.handleEvent.call(c,a)},d)}else"attachEvent"in a&&("object"==typeof c&&c.handleEvent?a.attachEvent("on"+b,function(){c.handleEvent.call(c)}):a.attachEvent("on"+b,c))},n=function(a,b,c,d){if("removeEventListener"in a)try{a.removeEventListener(b,c,d)}catch(e){if("object"!=typeof c||!c.handleEvent)throw e;a.removeEventListener(b,function(a){c.handleEvent.call(c,a)},d)}else"detachEvent"in a&&("object"==typeof c&&c.handleEvent?a.detachEvent("on"+b,function(){c.handleEvent.call(c)}):a.detachEvent("on"+b,c))},o=function(a){if(a.children.length<1)throw new Error("The Nav container has no containing elements");for(var b=[],c=0;c<a.children.length;c++)1===a.children[c].nodeType&&b.push(a.children[c]);return b},p=function(a,b){for(var c in b)a.setAttribute(c,b[c])},q=function(a,b){0!==a.className.indexOf(b)&&(a.className+=" "+b,a.className=a.className.replace(/(^\s*)|(\s*$)/g,""))},r=function(a,b){var c=new RegExp("(\\s|^)"+b+"(\\s|$)");a.className=a.className.replace(c," ").replace(/(^\s*)|(\s*$)/g,"")},s=function(a,b,c){for(var d=0;d<a.length;d++)b.call(c,d,a[d])},t=a.createElement("style"),u=a.documentElement,v=function(b,c){var d;this.options={animate:!0,transition:284,label:"Menu",insert:"before",customToggle:"",closeOnNavClick:!1,openPos:"relative",navClass:"nav-collapse",navActiveClass:"js-nav-active",jsClass:"js",init:function(){},open:function(){},close:function(){}};for(d in c)this.options[d]=c[d];if(q(u,this.options.jsClass),this.wrapperEl=b.replace("#",""),a.getElementById(this.wrapperEl))this.wrapper=a.getElementById(this.wrapperEl);else{if(!a.querySelector(this.wrapperEl))throw new Error("The nav element you are trying to select doesn't exist");this.wrapper=a.querySelector(this.wrapperEl)}this.wrapper.inner=o(this.wrapper),h=this.options,g=this.wrapper,this._init(this)};return v.prototype={destroy:function(){this._removeStyles(),r(g,"closed"),r(g,"opened"),r(g,h.navClass),r(g,h.navClass+"-"+this.index),r(u,h.navActiveClass),g.removeAttribute("style"),g.removeAttribute("aria-hidden"),n(b,"resize",this,!1),n(b,"focus",this,!1),n(a.body,"touchmove",this,!1),n(i,"touchstart",this,!1),n(i,"touchend",this,!1),n(i,"mouseup",this,!1),n(i,"keyup",this,!1),n(i,"click",this,!1),h.customToggle?i.removeAttribute("aria-hidden"):i.parentNode.removeChild(i)},toggle:function(){j===!0&&(l?this.close():this.open())},open:function(){l||(r(g,"closed"),q(g,"opened"),q(u,h.navActiveClass),q(i,"active"),g.style.position=h.openPos,p(g,{"aria-hidden":"false"}),l=!0,h.open())},close:function(){l&&(q(g,"closed"),r(g,"opened"),r(u,h.navActiveClass),r(i,"active"),p(g,{"aria-hidden":"true"}),h.animate?(j=!1,setTimeout(function(){g.style.position="absolute",j=!0},h.transition+10)):g.style.position="absolute",l=!1,h.close())},resize:function(){"none"!==b.getComputedStyle(i,null).getPropertyValue("display")?(k=!0,p(i,{"aria-hidden":"false"}),g.className.match(/(^|\s)closed(\s|$)/)&&(p(g,{"aria-hidden":"true"}),g.style.position="absolute"),this._createStyles(),this._calcHeight()):(k=!1,p(i,{"aria-hidden":"true"}),p(g,{"aria-hidden":"false"}),g.style.position=h.openPos,this._removeStyles())},handleEvent:function(a){var c=a||b.event;switch(c.type){case"touchstart":this._onTouchStart(c);break;case"touchmove":this._onTouchMove(c);break;case"touchend":case"mouseup":this._onTouchEnd(c);break;case"click":this._preventDefault(c);break;case"keyup":this._onKeyUp(c);break;case"focus":case"resize":this.resize(c)}},_init:function(){this.index=c++,q(g,h.navClass),q(g,h.navClass+"-"+this.index),q(g,"closed"),j=!0,l=!1,this._closeOnNavClick(),this._createToggle(),this._transitions(),this.resize();var d=this;setTimeout(function(){d.resize()},20),m(b,"resize",this,!1),m(b,"focus",this,!1),m(a.body,"touchmove",this,!1),m(i,"touchstart",this,!1),m(i,"touchend",this,!1),m(i,"mouseup",this,!1),m(i,"keyup",this,!1),m(i,"click",this,!1),h.init()},_createStyles:function(){t.parentNode||(t.type="text/css",a.getElementsByTagName("head")[0].appendChild(t))},_removeStyles:function(){t.parentNode&&t.parentNode.removeChild(t)},_createToggle:function(){if(h.customToggle){var b=h.customToggle.replace("#","");if(a.getElementById(b))i=a.getElementById(b);else{if(!a.querySelector(b))throw new Error("The custom nav toggle you are trying to select doesn't exist");i=a.querySelector(b)}}else{var c=a.createElement("a");c.innerHTML=h.label,p(c,{href:"#","class":"menu__toggle"}),"after"===h.insert?g.parentNode.insertBefore(c,g.nextSibling):g.parentNode.insertBefore(c,g),i=c}},_closeOnNavClick:function(){if(h.closeOnNavClick){var a=g.getElementsByTagName("a"),b=this;s(a,function(c){m(a[c],"click",function(){k&&b.toggle()},!1)})}},_preventDefault:function(a){return a.preventDefault?(a.stopImmediatePropagation&&a.stopImmediatePropagation(),a.preventDefault(),a.stopPropagation(),!1):void(a.returnValue=!1)},_onTouchStart:function(a){Event.prototype.stopImmediatePropagation||this._preventDefault(a),this.startX=a.touches[0].clientX,this.startY=a.touches[0].clientY,this.touchHasMoved=!1,n(i,"mouseup",this,!1)},_onTouchMove:function(a){(Math.abs(a.touches[0].clientX-this.startX)>10||Math.abs(a.touches[0].clientY-this.startY)>10)&&(this.touchHasMoved=!0)},_onTouchEnd:function(a){if(this._preventDefault(a),k&&!this.touchHasMoved){if("touchend"===a.type)return void this.toggle();var c=a||b.event;3!==c.which&&2!==c.button&&this.toggle()}},_onKeyUp:function(a){var c=a||b.event;13===c.keyCode&&this.toggle()},_transitions:function(){if(h.animate){var a=g.style,b="max-height "+h.transition+"ms";a.WebkitTransition=a.MozTransition=a.OTransition=a.transition=b}},_calcHeight:function(){for(var a=0,b=0;b<g.inner.length;b++)a+=g.inner[b].offsetHeight;var c="."+h.jsClass+" ."+h.navClass+"-"+this.index+".opened{max-height:"+a+"px !important} ."+h.jsClass+" ."+h.navClass+"-"+this.index+".opened.dropdown-active {max-height:9999px !important}";t.styleSheet?t.styleSheet.cssText=c:t.innerHTML=c,c=""}},new v(d,e)};"undefined"!=typeof module&&module.exports?module.exports=d:b.responsiveNav=d}(document,window,0);

function copyToClipboard() {
    // Create an auxiliary hidden input
    var aux = document.createElement("textarea");
    // Get the text from the element passed into the input
    var codeElements = document.getElementsByClassName("r");
    // iterate over all code boxes & collect code
    var i;
    var codeBuffer = [];
    for (i = 0; i < codeElements.length; i++) {
        var codeSnippet = codeElements[i].innerText; 
        codeBuffer.push(codeSnippet);
    }   
    var code = codeBuffer.join("<br><br>");
    // regExpr for replacing breaks with newlines
    var brRegex = /<br\s*[\/]?>/gi;
    // console.log(code);
    code = code.replace(brRegex, "\r\n");
    aux.value = code;
    // Append the aux input to the body
    document.body.appendChild(aux);
    // Highlight the content
    aux.select();
    // Execute the copy command
    document.execCommand("copy");
    // Remove the input from the body
    document.body.removeChild(aux);
    // change button text (copied!)
    var oldHtml = $("#copyButton span").html();
    $("#copyButton span").text("Copied!");
    // restore old html when time has passed
    
    setTimeout(function(oldHtml) {
        $("#copyButton span").html(oldHtml)},
        5000, oldHtml
    ) ;
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
function changeCommentButton() {
    // change comment submit button upon press
    var oldHtml = $("#commentSubmitButton").val();
    $("#commentSubmitButton").val("Submitting comment, please be patient ...");
    // restore old html when time has passed
    setTimeout(function(oldHtml) {
        $("#commentSubmitButton").val(oldHtml)},
        15000, oldHtml
    );
}

// collapse comment function
/*
$(document).ready(function () {
	const charLimit = 512;
    var collapseComment = function (comment) {
        var len = 0;
		var commentText = $(comment).find('.commentText');
		var commentHtml = commentText.html();
        commentText.children().each(function (i, p) {
            var $p = $(p);
			var pHtml = $p.html(); // raw html code for truncation
			var pText = $p.text(); // use text for counting	
            if (len > charLimit) {
                // if already above char limit, hide all subsequent p's
                $p.hide();
                return;
            }
            $p.data('originalText', pHtml); // store the original HTML
            if (len + pText.length > charLimit) {
				// need to truncate now!
				// when we would like to truncate, need to look into html children
				// and truncate the text there. that's it.
				// if there's none: truncate here. otherwise there
				var children = $(p).children();
				var newHtml = "";
				if (children.length == 0) {
					// there's no html: safe to truncate
					var htmlSplit = pHtml.split("/>\s*</");
					//console.log(htmlSplit);
					var tag = ($p)[0].tagName;
					//newHtml = "<" + tag + ">" + pText.substring(0, charLimit - len);
					newHtml = pText.substring(0, charLimit - len);

					//newHtml = pText.substring(0, charLimit - len);
				} else {
					newHtml = pHtml;
					// console.log(len + pText.length);
					// var childLen = len;
					//children.each(function (j, child ) {
						// var childText = $(child).text(); // use text for counting	
						// if (childLen > charLimit) {
							// console.log("Hiding");
							// child.hide();
						// }
						// childLen += childText.length;
						// console.log(childLen);
					// })
				}
                $p.html(newHtml);  // set text to truncated string
				//$p.outerHTML = "<span>" + newHtml + "</span>";
				// add link for expansion: this is within the current p element, which will be replaced when expanding
				if ($p.find(".expand").length == 0) {
                	$('<span> ...</span><svg class="expand comment-icon" viewBox="0 0 20 20"><path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path></svg>').appendTo($p);
				}
            }
            len += pText.length;
        });
    };
    $('.post-comments').on('click', '.expand', function (e) {
		// show all html elements of the comment:
		// selected $p is not always correct. sometimes it's the svg path rather than the last elemnt
		// console.log("Click on Expand");
		// console.log($(e));
		// console.log($(e.currentTarget)); // NB: don't use target. this is the clicked element (e.g. path, not the svg necessarily)
        var $p = $(e.currentTarget).parent(); 
		var children = $p.parents('.commentText').children();
		children.show().children().show();	
		if ($p.data('originalText')) {
			// restore text that was truncated
        	$p.html($p.data('originalText')); // restore text
		} else {
			return;
		}
		// show children again
        var $lastP = children
            .show() // show all siblings
            .last(); // get the last
		if ($lastP.find(".collapse").length == 0) {
			// only append collapse button once
			//console.log("Appending collapse button!");
        	$('<svg class="collapse comment-icon" viewBox="0 0 20 20"><path d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"></path></svg>').appendTo($lastP);
		} 
    });
    $('.post-comments').on('click', '.collapse', function (e) {
        var $anchor = $(e.currentTarget);
        collapseComment($anchor.parents('.post-comment'));
        $anchor.remove();
    });
    // by default, collapse all comments
    $('.post-comment').each(function (i, comment) {
        collapseComment($(comment));
    });
});
*/
function goBackToOrigin() {
    window.location.href = location.pathname;
}
