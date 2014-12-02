{"filter":false,"title":"Utility.js","tooltip":"/src/Utility.js","undoManager":{"mark":3,"position":3,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":0,"column":21},"action":"insert","lines":["requestAnimationFrame"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":0,"column":21},"action":"remove","lines":["requestAnimationFrame"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":195,"column":2},"action":"insert","lines":["/**"," * Normalize the browser animation API across implementations. This requests"," * the browser to schedule a repaint of the window for the next animation frame."," * Checks for cross-browser support, and, failing to find it, falls back to setTimeout."," * @param {function}    callback  Function to call when it's time to update your animation for the next repaint."," * @param {HTMLElement} element   Optional parameter specifying the element that visually bounds the entire animation."," * @return {number} Animation frame request."," */","if (!window.requestAnimationFrame) {","  window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||","                                  window.mozRequestAnimationFrame ||","                                  window.msRequestAnimationFrame ||","                                  window.oRequestAnimationFrame ||","                                  function (callback) {","                                    return window.setTimeout(callback, 17 /*~ 1000/60*/);","                                  });","}","","/**"," * ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec."," *"," * Cancels an animation frame request."," * Checks for cross-browser support, falls back to clearTimeout."," * @param {number}  Animation frame request."," */","if (!window.cancelAnimationFrame) {","  window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||","                                 window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||","                                 window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||","                                 window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||","                                 window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||","                                 window.clearTimeout);","}","","/* Object that contains our utility functions."," * Attached to the window object which acts as the global namespace."," */","window.utils = {};","","/**"," * Keeps track of the current mouse position, relative to an element."," * @param {HTMLElement} element"," * @return {object} Contains properties: x, y, event"," */","window.utils.captureMouse = function (element) {","  var mouse = {x: 0, y: 0, event: null},","      body_scrollLeft = document.body.scrollLeft,","      element_scrollLeft = document.documentElement.scrollLeft,","      body_scrollTop = document.body.scrollTop,","      element_scrollTop = document.documentElement.scrollTop,","      offsetLeft = element.offsetLeft,","      offsetTop = element.offsetTop;","  ","  element.addEventListener('mousemove', function (event) {","    var x, y;","    ","    if (event.pageX || event.pageY) {","      x = event.pageX;","      y = event.pageY;","    } else {","      x = event.clientX + body_scrollLeft + element_scrollLeft;","      y = event.clientY + body_scrollTop + element_scrollTop;","    }","    x -= offsetLeft;","    y -= offsetTop;","    ","    mouse.x = x;","    mouse.y = y;","    mouse.event = event;","  }, false);","  ","  return mouse;","};","","/**"," * Keeps track of the current (first) touch position, relative to an element."," * @param {HTMLElement} element"," * @return {object} Contains properties: x, y, isPressed, event"," */","window.utils.captureTouch = function (element) {","  var touch = {x: null, y: null, isPressed: false, event: null},","      body_scrollLeft = document.body.scrollLeft,","      element_scrollLeft = document.documentElement.scrollLeft,","      body_scrollTop = document.body.scrollTop,","      element_scrollTop = document.documentElement.scrollTop,","      offsetLeft = element.offsetLeft,","      offsetTop = element.offsetTop;","","  element.addEventListener('touchstart', function (event) {","    touch.isPressed = true;","    touch.event = event;","  }, false);","","  element.addEventListener('touchend', function (event) {","    touch.isPressed = false;","    touch.x = null;","    touch.y = null;","    touch.event = event;","  }, false);","  ","  element.addEventListener('touchmove', function (event) {","    var x, y,","        touch_event = event.touches[0]; //first touch","    ","    if (touch_event.pageX || touch_event.pageY) {","      x = touch_event.pageX;","      y = touch_event.pageY;","    } else {","      x = touch_event.clientX + body_scrollLeft + element_scrollLeft;","      y = touch_event.clientY + body_scrollTop + element_scrollTop;","    }","    x -= offsetLeft;","    y -= offsetTop;","    ","    touch.x = x;","    touch.y = y;","    touch.event = event;","  }, false);","  ","  return touch;","};","","/**"," * Returns a color in the format: '#RRGGBB', or as a hex number if specified."," * @param {number|string} color"," * @param {boolean=}      toNumber=false  Return color as a hex number."," * @return {string|number}"," */","window.utils.parseColor = function (color, toNumber) {","  if (toNumber === true) {","    if (typeof color === 'number') {","      return (color | 0); //chop off decimal","    }","    if (typeof color === 'string' && color[0] === '#') {","      color = color.slice(1);","    }","    return window.parseInt(color, 16);","  } else {","    if (typeof color === 'number') {","      color = '#' + ('00000' + (color | 0).toString(16)).substr(-6); //pad","    }","    return color;","  }","};","","/**"," * Converts a color to the RGB string format: 'rgb(r,g,b)' or 'rgba(r,g,b,a)'"," * @param {number|string} color"," * @param {number}        alpha"," * @return {string}"," */","window.utils.colorToRGB = function (color, alpha) {","  //number in octal format or string prefixed with #","  if (typeof color === 'string' && color[0] === '#') {","    color = window.parseInt(color.slice(1), 16);","  }","  alpha = (alpha === undefined) ? 1 : alpha;","  //parse hex values","  var r = color >> 16 & 0xff,","      g = color >> 8 & 0xff,","      b = color & 0xff,","      a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);","  //only use 'rgba' if needed","  if (a === 1) {","    return \"rgb(\"+ r +\",\"+ g +\",\"+ b +\")\";","  } else {","    return \"rgba(\"+ r +\",\"+ g +\",\"+ b +\",\"+ a +\")\";","  }","};","","/**"," * Determine if a rectangle contains the coordinates (x,y) within it's boundaries."," * @param {object}  rect  Object with properties: x, y, width, height."," * @param {number}  x     Coordinate position x."," * @param {number}  y     Coordinate position y."," * @return {boolean}"," */","window.utils.containsPoint = function (rect, x, y) {","  return !(x < rect.x ||","           x > rect.x + rect.width ||","           y < rect.y ||","           y > rect.y + rect.height);","};","","/**"," * Determine if two rectangles overlap."," * @param {object}  rectA Object with properties: x, y, width, height."," * @param {object}  rectB Object with properties: x, y, width, height."," * @return {boolean}"," */","window.utils.intersects = function (rectA, rectB) {","  return !(rectA.x + rectA.width < rectB.x ||","           rectB.x + rectB.width < rectA.x ||","           rectA.y + rectA.height < rectB.y ||","           rectB.y + rectB.height < rectA.y);","};"]}]}],[{"group":"doc","deltas":[{"start":{"row":9,"column":2},"end":{"row":9,"column":4},"action":"insert","lines":["  "]},{"start":{"row":10,"column":8},"end":{"row":10,"column":34},"action":"remove","lines":["                          "]},{"start":{"row":11,"column":8},"end":{"row":11,"column":34},"action":"remove","lines":["                          "]},{"start":{"row":12,"column":8},"end":{"row":12,"column":34},"action":"remove","lines":["                          "]},{"start":{"row":13,"column":8},"end":{"row":13,"column":34},"action":"remove","lines":["                          "]},{"start":{"row":13,"column":16},"end":{"row":13,"column":17},"action":"remove","lines":[" "]},{"start":{"row":14,"column":12},"end":{"row":14,"column":36},"action":"remove","lines":["                        "]},{"start":{"row":14,"column":63},"end":{"row":14,"column":64},"action":"insert","lines":[" "]},{"start":{"row":15,"column":0},"end":{"row":15,"column":26},"action":"remove","lines":["                          "]},{"start":{"row":26,"column":2},"end":{"row":26,"column":4},"action":"insert","lines":["  "]},{"start":{"row":27,"column":8},"end":{"row":27,"column":33},"action":"remove","lines":["                         "]},{"start":{"row":28,"column":8},"end":{"row":28,"column":33},"action":"remove","lines":["                         "]},{"start":{"row":29,"column":8},"end":{"row":29,"column":33},"action":"remove","lines":["                         "]},{"start":{"row":30,"column":8},"end":{"row":30,"column":33},"action":"remove","lines":["                         "]},{"start":{"row":31,"column":8},"end":{"row":31,"column":33},"action":"remove","lines":["                         "]},{"start":{"row":44,"column":36},"end":{"row":44,"column":37},"action":"remove","lines":[" "]},{"start":{"row":45,"column":0},"end":{"row":45,"column":2},"action":"insert","lines":["  "]},{"start":{"row":45,"column":17},"end":{"row":46,"column":12},"action":"insert","lines":["","            "]},{"start":{"row":46,"column":17},"end":{"row":47,"column":11},"action":"insert","lines":["","           "]},{"start":{"row":47,"column":17},"end":{"row":48,"column":11},"action":"insert","lines":["","           "]},{"start":{"row":48,"column":23},"end":{"row":49,"column":8},"action":"insert","lines":["","        "]},{"start":{"row":50,"column":0},"end":{"row":50,"column":2},"action":"insert","lines":["  "]},{"start":{"row":51,"column":0},"end":{"row":51,"column":1},"action":"insert","lines":[" "]},{"start":{"row":51,"column":7},"end":{"row":51,"column":8},"action":"insert","lines":[" "]},{"start":{"row":52,"column":0},"end":{"row":52,"column":2},"action":"insert","lines":["  "]},{"start":{"row":53,"column":6},"end":{"row":53,"column":8},"action":"insert","lines":["  "]},{"start":{"row":54,"column":0},"end":{"row":54,"column":1},"action":"insert","lines":[" "]},{"start":{"row":54,"column":7},"end":{"row":54,"column":8},"action":"insert","lines":[" "]},{"start":{"row":55,"column":6},"end":{"row":55,"column":8},"action":"insert","lines":["  "]},{"start":{"row":56,"column":0},"end":{"row":57,"column":0},"action":"insert","lines":["",""]},{"start":{"row":57,"column":2},"end":{"row":58,"column":0},"action":"remove","lines":["",""]},{"start":{"row":57,"column":50},"end":{"row":57,"column":51},"action":"remove","lines":[" "]},{"start":{"row":58,"column":0},"end":{"row":58,"column":3},"action":"insert","lines":["   "]},{"start":{"row":58,"column":7},"end":{"row":58,"column":8},"action":"insert","lines":[" "]},{"start":{"row":59,"column":0},"end":{"row":60,"column":0},"action":"insert","lines":["",""]},{"start":{"row":60,"column":4},"end":{"row":61,"column":0},"action":"remove","lines":["",""]},{"start":{"row":61,"column":0},"end":{"row":61,"column":4},"action":"insert","lines":["    "]},{"start":{"row":61,"column":10},"end":{"row":61,"column":12},"action":"insert","lines":["  "]},{"start":{"row":62,"column":0},"end":{"row":62,"column":4},"action":"insert","lines":["    "]},{"start":{"row":62,"column":10},"end":{"row":62,"column":12},"action":"insert","lines":["  "]},{"start":{"row":63,"column":0},"end":{"row":63,"column":4},"action":"insert","lines":["    "]},{"start":{"row":63,"column":9},"end":{"row":64,"column":7},"action":"insert","lines":["","       "]},{"start":{"row":65,"column":0},"end":{"row":65,"column":3},"action":"insert","lines":["   "]},{"start":{"row":65,"column":9},"end":{"row":65,"column":12},"action":"insert","lines":["   "]},{"start":{"row":66,"column":0},"end":{"row":66,"column":3},"action":"insert","lines":["   "]},{"start":{"row":66,"column":9},"end":{"row":66,"column":12},"action":"insert","lines":["   "]},{"start":{"row":67,"column":0},"end":{"row":67,"column":2},"action":"insert","lines":["  "]},{"start":{"row":67,"column":6},"end":{"row":67,"column":8},"action":"insert","lines":["  "]},{"start":{"row":68,"column":0},"end":{"row":68,"column":4},"action":"insert","lines":["    "]},{"start":{"row":69,"column":4},"end":{"row":69,"column":8},"action":"insert","lines":["    "]},{"start":{"row":69,"column":23},"end":{"row":70,"column":0},"action":"insert","lines":["",""]},{"start":{"row":71,"column":4},"end":{"row":72,"column":0},"action":"remove","lines":["",""]},{"start":{"row":72,"column":4},"end":{"row":72,"column":8},"action":"insert","lines":["    "]},{"start":{"row":73,"column":0},"end":{"row":73,"column":2},"action":"insert","lines":["  "]},{"start":{"row":73,"column":6},"end":{"row":73,"column":8},"action":"insert","lines":["  "]},{"start":{"row":74,"column":2},"end":{"row":74,"column":4},"action":"insert","lines":["  "]},{"start":{"row":75,"column":0},"end":{"row":76,"column":0},"action":"insert","lines":["",""]},{"start":{"row":76,"column":2},"end":{"row":77,"column":0},"action":"remove","lines":["",""]},{"start":{"row":84,"column":36},"end":{"row":84,"column":37},"action":"remove","lines":[" "]},{"start":{"row":85,"column":0},"end":{"row":85,"column":2},"action":"insert","lines":["  "]},{"start":{"row":85,"column":17},"end":{"row":86,"column":12},"action":"insert","lines":["","            "]},{"start":{"row":86,"column":20},"end":{"row":87,"column":11},"action":"insert","lines":["","           "]},{"start":{"row":87,"column":20},"end":{"row":88,"column":11},"action":"insert","lines":["","           "]},{"start":{"row":88,"column":29},"end":{"row":89,"column":11},"action":"insert","lines":["","           "]},{"start":{"row":89,"column":23},"end":{"row":90,"column":8},"action":"insert","lines":["","        "]},{"start":{"row":91,"column":0},"end":{"row":91,"column":2},"action":"insert","lines":["  "]},{"start":{"row":92,"column":0},"end":{"row":92,"column":2},"action":"insert","lines":["  "]},{"start":{"row":93,"column":0},"end":{"row":93,"column":1},"action":"insert","lines":[" "]},{"start":{"row":93,"column":7},"end":{"row":93,"column":8},"action":"insert","lines":[" "]},{"start":{"row":94,"column":0},"end":{"row":94,"column":2},"action":"insert","lines":["  "]},{"start":{"row":95,"column":6},"end":{"row":95,"column":8},"action":"insert","lines":["  "]},{"start":{"row":96,"column":0},"end":{"row":96,"column":1},"action":"insert","lines":[" "]},{"start":{"row":96,"column":7},"end":{"row":96,"column":8},"action":"insert","lines":[" "]},{"start":{"row":98,"column":0},"end":{"row":98,"column":2},"action":"insert","lines":["  "]},{"start":{"row":98,"column":51},"end":{"row":98,"column":52},"action":"remove","lines":[" "]},{"start":{"row":99,"column":0},"end":{"row":99,"column":1},"action":"insert","lines":[" "]},{"start":{"row":99,"column":5},"end":{"row":99,"column":8},"action":"insert","lines":["   "]},{"start":{"row":100,"column":0},"end":{"row":100,"column":3},"action":"insert","lines":["   "]},{"start":{"row":100,"column":7},"end":{"row":100,"column":8},"action":"insert","lines":[" "]},{"start":{"row":101,"column":2},"end":{"row":101,"column":4},"action":"insert","lines":["  "]},{"start":{"row":103,"column":0},"end":{"row":103,"column":2},"action":"insert","lines":["  "]},{"start":{"row":103,"column":49},"end":{"row":103,"column":50},"action":"remove","lines":[" "]},{"start":{"row":104,"column":0},"end":{"row":104,"column":4},"action":"insert","lines":["    "]},{"start":{"row":105,"column":0},"end":{"row":105,"column":1},"action":"insert","lines":[" "]},{"start":{"row":105,"column":5},"end":{"row":105,"column":8},"action":"insert","lines":["   "]},{"start":{"row":106,"column":0},"end":{"row":106,"column":2},"action":"insert","lines":["  "]},{"start":{"row":106,"column":6},"end":{"row":106,"column":8},"action":"insert","lines":["  "]},{"start":{"row":107,"column":0},"end":{"row":107,"column":4},"action":"insert","lines":["    "]},{"start":{"row":108,"column":2},"end":{"row":108,"column":4},"action":"insert","lines":["  "]},{"start":{"row":109,"column":0},"end":{"row":110,"column":0},"action":"insert","lines":["",""]},{"start":{"row":110,"column":2},"end":{"row":111,"column":0},"action":"remove","lines":["",""]},{"start":{"row":110,"column":50},"end":{"row":110,"column":51},"action":"remove","lines":[" "]},{"start":{"row":111,"column":4},"end":{"row":111,"column":8},"action":"insert","lines":["    "]},{"start":{"row":112,"column":0},"end":{"row":112,"column":2},"action":"insert","lines":["  "]},{"start":{"row":112,"column":10},"end":{"row":112,"column":12},"action":"insert","lines":["  "]},{"start":{"row":112,"column":57},"end":{"row":113,"column":0},"action":"insert","lines":["",""]},{"start":{"row":114,"column":4},"end":{"row":115,"column":0},"action":"remove","lines":["",""]},{"start":{"row":115,"column":0},"end":{"row":115,"column":1},"action":"insert","lines":[" "]},{"start":{"row":115,"column":7},"end":{"row":115,"column":12},"action":"insert","lines":["     "]},{"start":{"row":116,"column":0},"end":{"row":116,"column":1},"action":"insert","lines":[" "]},{"start":{"row":116,"column":7},"end":{"row":116,"column":12},"action":"insert","lines":["     "]},{"start":{"row":117,"column":0},"end":{"row":117,"column":1},"action":"insert","lines":[" "]},{"start":{"row":117,"column":5},"end":{"row":117,"column":8},"action":"insert","lines":["   "]},{"start":{"row":117,"column":9},"end":{"row":118,"column":7},"action":"insert","lines":["","       "]},{"start":{"row":119,"column":6},"end":{"row":119,"column":12},"action":"insert","lines":["      "]},{"start":{"row":120,"column":0},"end":{"row":120,"column":5},"action":"insert","lines":["     "]},{"start":{"row":120,"column":11},"end":{"row":120,"column":12},"action":"insert","lines":[" "]},{"start":{"row":121,"column":4},"end":{"row":121,"column":8},"action":"insert","lines":["    "]},{"start":{"row":122,"column":0},"end":{"row":122,"column":4},"action":"insert","lines":["    "]},{"start":{"row":123,"column":0},"end":{"row":123,"column":2},"action":"insert","lines":["  "]},{"start":{"row":123,"column":6},"end":{"row":123,"column":8},"action":"insert","lines":["  "]},{"start":{"row":124,"column":0},"end":{"row":125,"column":0},"action":"insert","lines":["",""]},{"start":{"row":125,"column":4},"end":{"row":126,"column":0},"action":"remove","lines":["",""]},{"start":{"row":126,"column":0},"end":{"row":126,"column":4},"action":"insert","lines":["    "]},{"start":{"row":127,"column":4},"end":{"row":127,"column":8},"action":"insert","lines":["    "]},{"start":{"row":128,"column":2},"end":{"row":128,"column":4},"action":"insert","lines":["  "]},{"start":{"row":129,"column":0},"end":{"row":130,"column":0},"action":"insert","lines":["",""]},{"start":{"row":130,"column":2},"end":{"row":131,"column":0},"action":"remove","lines":["",""]},{"start":{"row":139,"column":34},"end":{"row":139,"column":35},"action":"remove","lines":[" "]},{"start":{"row":140,"column":0},"end":{"row":140,"column":2},"action":"insert","lines":["  "]},{"start":{"row":141,"column":0},"end":{"row":141,"column":4},"action":"insert","lines":["    "]},{"start":{"row":142,"column":6},"end":{"row":142,"column":12},"action":"insert","lines":["      "]},{"start":{"row":143,"column":4},"end":{"row":143,"column":8},"action":"insert","lines":["    "]},{"start":{"row":144,"column":0},"end":{"row":144,"column":1},"action":"insert","lines":[" "]},{"start":{"row":144,"column":5},"end":{"row":144,"column":8},"action":"insert","lines":["   "]},{"start":{"row":145,"column":6},"end":{"row":145,"column":12},"action":"insert","lines":["      "]},{"start":{"row":146,"column":0},"end":{"row":146,"column":2},"action":"insert","lines":["  "]},{"start":{"row":146,"column":6},"end":{"row":146,"column":8},"action":"insert","lines":["  "]},{"start":{"row":147,"column":0},"end":{"row":147,"column":4},"action":"insert","lines":["    "]},{"start":{"row":148,"column":2},"end":{"row":148,"column":4},"action":"insert","lines":["  "]},{"start":{"row":148,"column":5},"end":{"row":149,"column":3},"action":"insert","lines":["","   "]},{"start":{"row":150,"column":4},"end":{"row":150,"column":8},"action":"insert","lines":["    "]},{"start":{"row":151,"column":0},"end":{"row":151,"column":6},"action":"insert","lines":["      "]},{"start":{"row":152,"column":0},"end":{"row":152,"column":1},"action":"insert","lines":[" "]},{"start":{"row":152,"column":5},"end":{"row":152,"column":8},"action":"insert","lines":["   "]},{"start":{"row":153,"column":0},"end":{"row":153,"column":4},"action":"insert","lines":["    "]},{"start":{"row":154,"column":0},"end":{"row":154,"column":2},"action":"insert","lines":["  "]},{"start":{"row":163,"column":34},"end":{"row":163,"column":35},"action":"remove","lines":[" "]},{"start":{"row":164,"column":0},"end":{"row":164,"column":1},"action":"insert","lines":[" "]},{"start":{"row":164,"column":3},"end":{"row":164,"column":4},"action":"insert","lines":[" "]},{"start":{"row":165,"column":0},"end":{"row":165,"column":2},"action":"insert","lines":["  "]},{"start":{"row":166,"column":0},"end":{"row":166,"column":3},"action":"insert","lines":["   "]},{"start":{"row":166,"column":7},"end":{"row":166,"column":8},"action":"insert","lines":[" "]},{"start":{"row":167,"column":2},"end":{"row":167,"column":4},"action":"insert","lines":["  "]},{"start":{"row":168,"column":0},"end":{"row":168,"column":2},"action":"insert","lines":["  "]},{"start":{"row":169,"column":2},"end":{"row":169,"column":4},"action":"insert","lines":["  "]},{"start":{"row":170,"column":0},"end":{"row":170,"column":2},"action":"insert","lines":["  "]},{"start":{"row":171,"column":0},"end":{"row":171,"column":2},"action":"insert","lines":["  "]},{"start":{"row":172,"column":6},"end":{"row":172,"column":8},"action":"insert","lines":["  "]},{"start":{"row":173,"column":0},"end":{"row":173,"column":2},"action":"insert","lines":["  "]},{"start":{"row":174,"column":0},"end":{"row":174,"column":1},"action":"insert","lines":[" "]},{"start":{"row":174,"column":3},"end":{"row":174,"column":4},"action":"insert","lines":[" "]},{"start":{"row":175,"column":2},"end":{"row":175,"column":4},"action":"insert","lines":["  "]},{"start":{"row":176,"column":0},"end":{"row":176,"column":3},"action":"insert","lines":["   "]},{"start":{"row":176,"column":7},"end":{"row":176,"column":8},"action":"insert","lines":[" "]},{"start":{"row":176,"column":21},"end":{"row":176,"column":22},"action":"insert","lines":[" "]},{"start":{"row":176,"column":27},"end":{"row":176,"column":28},"action":"insert","lines":[" "]},{"start":{"row":176,"column":31},"end":{"row":176,"column":32},"action":"insert","lines":[" "]},{"start":{"row":176,"column":37},"end":{"row":176,"column":38},"action":"insert","lines":[" "]},{"start":{"row":176,"column":41},"end":{"row":176,"column":42},"action":"insert","lines":[" "]},{"start":{"row":176,"column":47},"end":{"row":176,"column":48},"action":"insert","lines":[" "]},{"start":{"row":177,"column":0},"end":{"row":177,"column":1},"action":"insert","lines":[" "]},{"start":{"row":177,"column":3},"end":{"row":177,"column":4},"action":"insert","lines":[" "]},{"start":{"row":177,"column":5},"end":{"row":178,"column":3},"action":"insert","lines":["","   "]},{"start":{"row":179,"column":0},"end":{"row":179,"column":3},"action":"insert","lines":["   "]},{"start":{"row":179,"column":7},"end":{"row":179,"column":8},"action":"insert","lines":[" "]},{"start":{"row":179,"column":22},"end":{"row":179,"column":23},"action":"insert","lines":[" "]},{"start":{"row":179,"column":28},"end":{"row":179,"column":29},"action":"insert","lines":[" "]},{"start":{"row":179,"column":32},"end":{"row":179,"column":33},"action":"insert","lines":[" "]},{"start":{"row":179,"column":38},"end":{"row":179,"column":39},"action":"insert","lines":[" "]},{"start":{"row":179,"column":42},"end":{"row":179,"column":43},"action":"insert","lines":[" "]},{"start":{"row":179,"column":48},"end":{"row":179,"column":49},"action":"insert","lines":[" "]},{"start":{"row":179,"column":52},"end":{"row":179,"column":53},"action":"insert","lines":[" "]},{"start":{"row":179,"column":58},"end":{"row":179,"column":59},"action":"insert","lines":[" "]},{"start":{"row":180,"column":0},"end":{"row":180,"column":2},"action":"insert","lines":["  "]},{"start":{"row":190,"column":37},"end":{"row":190,"column":38},"action":"remove","lines":[" "]},{"start":{"row":191,"column":0},"end":{"row":191,"column":2},"action":"insert","lines":["  "]},{"start":{"row":192,"column":0},"end":{"row":192,"column":3},"action":"remove","lines":["   "]},{"start":{"row":193,"column":8},"end":{"row":193,"column":11},"action":"remove","lines":["   "]},{"start":{"row":194,"column":0},"end":{"row":194,"column":3},"action":"remove","lines":["   "]},{"start":{"row":203,"column":34},"end":{"row":203,"column":35},"action":"remove","lines":[" "]},{"start":{"row":204,"column":0},"end":{"row":204,"column":2},"action":"insert","lines":["  "]},{"start":{"row":205,"column":0},"end":{"row":205,"column":3},"action":"remove","lines":["   "]},{"start":{"row":206,"column":8},"end":{"row":206,"column":11},"action":"remove","lines":["   "]},{"start":{"row":207,"column":0},"end":{"row":207,"column":3},"action":"remove","lines":["   "]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":15,"column":11},"end":{"row":15,"column":11},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1417548641911,"hash":"8c828ab2b98aff63dbea00be15296bb8df72e83f"}