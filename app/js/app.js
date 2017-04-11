// Central JS Controller: for main app functions as well as calling modules

const $ = require('jquery'); // https://www.npmjs.com/package/jquery
const clean = require('./js/clean.js');
const file = require('./js/file.js');
const library = require('./js/library.js');
const page = require('./js/page.js');
const title = require('./js/title.js');

// Variables
const imgOne = document.getElementById('viewImgOne');
const imgTwo = document.getElementById('viewImgTwo');
const inner = document.getElementById('innerWindow');
const optWindow = document.getElementById('optWindow');
const viewer = document.getElementById('viewer');
const zoomSlide = document.getElementById('zoomSlider');

// Function Variables
let handleError, zoomTextUpdate, objPositioner, imgDivResizer, pageZoom, libSlider, dropDown, filterToggle;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// Key press Checker
$(document).keydown(function (event) {
  if (document.activeElement.id === 'zoomText' || document.activeElement.tagName === 'INPUT') {
    // Do nothing when focused on zoom input
  } else if ($('#viewer').hasClass('active')) {
    // Check if file is loaded. See file.js: postExtract()
    if (event.which === 37) { // left key
      page.Left();
    } else if (event.which === 39) { // right key
      page.Right();
    }
  }
});

// Error Handling
handleError = (evt) => {
  if (evt.message) {
    alert(`Error: ${evt.message} at linenumber: ${evt.lineno} of file: ${evt.filename}`);
  } else {
    alert(`Error: ${evt.type} from element: ${(evt.srcElement || evt.target)}`);
  }
};
window.addEventListener('error', handleError, true);

// Builds library on load
library.onLoad();

// Updates title with version
title.onLoad();

// Syncs dial to output box
zoomTextUpdate = (val) => {
  document.querySelector('#zoomText').value = val;
};

objPositioner = () => {
  document.getElementById('dirLib').style.height = `${window.innerHeight - 56}px`;
  document.getElementById('viewer').style.height = `${window.innerHeight - 56}px`;
  document.getElementById('bgLoader').style.left = `${window.innerWidth / 2 - 75}px`;
  document.getElementById('bgLoader').style.top = `${window.innerHeight / 2 - 75}px`;
  document.getElementById('loader').style.left = `${window.innerWidth / 2 - 75}px`;
  document.getElementById('loader').style.top = `${window.innerHeight / 2 - 75}px`;
  document.getElementById('innerWindow').style.top = `${window.innerHeight - 56}px`;
  document.getElementById('libDropDown').style.left = `${window.innerWidth / 2 - 38.5}px`;
  document.getElementById('mainLib').style.height = `${window.innerHeight - 86}px`;
  document.getElementById('libList').style.height = `${window.innerHeight - 142}px`;
};

// Formats page to variable window sizes
$(document).ready(function () { // On Load
  objPositioner();
  window.onresize = function () { // On Change
    objPositioner();
    imgDivResizer();
  };
});

// Function that resizes innerWindow div
imgDivResizer = () => {
  if (imgOne.clientHeight >= imgTwo.clientHeight) {
    inner.style.height = `${imgOne.clientHeight}px`;
  } else {
    inner.style.height = `${imgTwo.clientHeight}px`;
  }
};

// Adds an event listener to both images
let images = document.getElementsByClassName('image');
for (let j = 0; j < images.length; j++) {
  images[j].addEventListener('load', function () {
    imgDivResizer();
  });
}

// Handles the zoom
pageZoom = () => {
  // Center Points
  let cPX = viewer.scrollTop + viewer.clientHeight / 2;
  let cPY = viewer.scrollLeft + viewer.clientWidth / 2;

  // Position Ratios to whole
  let cPXR = cPX / inner.clientHeight;
  let cPYR = cPY / inner.clientWidth;

  // Sets the width for the viewer window
  inner.style.width = `${zoomSlide.value}%`;
  if (zoomSlide.value < 100) {
    inner.style.marginLeft = `${(100 - zoomSlide.value) / 2}%`;
  } else {
    inner.style.marginLeft = 0;
  }

  imgDivResizer();

  // Sets margins as necessary
  if (viewer.clientHeight > inner.clientHeight) {
    inner.style.marginTop = `${(viewer.clientHeight - inner.clientHeight) / 2}px`;
  } else {
    inner.style.marginTop = 0;
  }
  viewer.scrollTop = inner.clientHeight * cPXR - viewer.clientHeight / 2;
  viewer.scrollLeft = inner.clientWidth * cPYR - viewer.clientWidth / 2;
  let val = document.getElementById('zoomSlider').value;
  zoomTextUpdate(val);
};

// Library Windows collapsing
libSlider = () => {
  $('#sideLib').toggleClass('shift-left');
};
dropDown = () => {
  $('#mainLib').slideToggle(800);
};

// dragscroll things
$('#zoomSlider').mouseenter(function () {
  $('#viewer').removeClass('dragscroll');
  $('#zoomSlider').focus();
}).mouseleave(function () {
  $('#viewer').addClass('dragscroll');
  $('#zoomSlider').blur();
});

$('#optWindow').mouseenter(function () {
  $('#viewer').removeClass('dragscroll');
  $('#optWindow').focus();
}).mouseleave(function () {
  $('#viewer').addClass('dragscroll');
  $('#optWindow').blur();
});


// Filter Options for image quality
filterToggle = () => {
  let options = $('#optWindow');
  options.slideToggle(400, function() {
    if (options.is(':animated')) return;
  });
};

// Button functions

// zoomSlider
document.getElementById('zoomSlider').addEventListener('input',
  function() {
    pageZoom();
  }
);

// Page navigation
document.getElementById('column').addEventListener('click',
  function() {
    page.spread();
  }
);
document.getElementById('pageLeft').addEventListener('click',
  function() {
    page.Left();
  }
);
document.getElementById('pageRight').addEventListener('click',
  function() {
    page.Right();
  }
);
document.getElementById('openFile').addEventListener('click',
  function() {
    file.dialog();
  }
);
document.getElementById('trash').addEventListener('click',
  function() {
    clean.trash();
  }
);

// Library navigation & functions
document.getElementById('libSlider').addEventListener('click',
  function() {
    libSlider();
  }
);
document.getElementById('openDirectory').addEventListener('click',
  function() {
    library.openDir();
  }
);
document.getElementById('libDropDown').addEventListener('click',
  function() {
    dropDown();
  }
);
document.getElementById('options').addEventListener('click',
  function() {
    filterToggle();
  }
);

// Option Defaults
let display = {
  'brightness': 'brightness(1.0)',
  'contrast': 'contrast(1.0)',
  'grayscale': 'grayscale(0.0)',
  style: function() {
    return `${this.brightness} ${this.contrast} ${this.grayscale}`;
  }
};
inner.style.webkitFilter = display.style();

// Option :: Updates Styles and Text
let options = optWindow.getElementsByTagName('input');
for (let r = 0; r < options.length; r++) {
  options[r].addEventListener('input', function() {
    let val = options[r].value;
    let style = options[r].dataset.style;
    display[style] = `${style}(${val})`;
    inner.style.webkitFilter = display.style();
    let text = document.querySelector(`#opt${style.capitalize()}Text`);
    text.value = val;
  });
}

// Options :: Reset Buttons
let buttons = optWindow.getElementsByTagName('button');
for(let b = 0; b < buttons.length; b++) {
  let style = buttons[b].dataset.style;
  buttons[b].addEventListener('click', function() {
    let c = style.capitalize();
    let range = document.querySelector(`#opt${c}Range`);
    let text = document.querySelector(`#opt${c}Text`);
    let d = range.dataset.default;
    display[style] = `${style}(${d})`;
    inner.style.webkitFilter = display.style();
    range.value = range.dataset.default;
    text.value = range.dataset.default;
  });
}
