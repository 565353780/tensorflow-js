"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let init_model = (() => {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var myYolo;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return _tfjsYolo2.default.v3("waterDrop_2class/my_tfjs_model/model.json");

                case 2:
                    myYolo = _context.sent;
                    return _context.abrupt("return", myYolo);

                case 4:
                case "end":
                    return _context.stop();
            }
        }, _callee, this);
    }));

    return function init_model() {
        return _ref.apply(this, arguments);
    };
})();

let detect = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(model) {
        var hidden_canvas, boxes;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
                case 0:
                    hidden_canvas = document.getElementById("HiddenCanvas");
                    // Optional settings

                    _context2.next = 3;
                    return model.predict(hidden_canvas, {
                        maxBoxes: 2, // defaults to 20
                        scoreThreshold: .2, // defaults to .5
                        iouThreshold: .5, // defaults to .3
                        numClasses: 2, // defaults to 80 for yolo v3, tiny yolo v2, v3 and 20 for tiny yolo v1
                        anchors: [10, 14, 23, 27, 37, 58, 81, 82, 135, 169, 344, 319], // See ./src/config.js for examples
                        classNames: ["container", "waterdrop"], // defaults to coco classes for yolo v3, tiny yolo v2, v3 and voc classes for tiny yolo v1
                        inputSize: 416 // defaults to 416
                    });

                case 3:
                    boxes = _context2.sent;
                    return _context2.abrupt("return", boxes);

                case 5:
                case "end":
                    return _context2.stop();
            }
        }, _callee2, this);
    }));

    return function detect(_x) {
        return _ref2.apply(this, arguments);
    };
})();

let video_cap = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var video, hidden_canvas, hidden_ctx;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
                case 0:
                    video = document.getElementById("Video");
                    hidden_canvas = document.getElementById("HiddenCanvas");

                    hidden_canvas.width = video.videoWidth;
                    hidden_canvas.height = video.videoHeight;
                    hidden_ctx = hidden_canvas.getContext("2d");

                    hidden_ctx.drawImage(video, 0, 0);

                case 6:
                case "end":
                    return _context3.stop();
            }
        }, _callee3, this);
    }));

    return function video_cap() {
        return _ref3.apply(this, arguments);
    };
})();

var _tfjsYolo = require("tfjs-yolo");

var _tfjsYolo2 = _interopRequireDefault(_tfjsYolo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var detect_num = 0;
var d = new Date();
var start_time = d.getTime();

init_model().then(model => {
    console.log("init_model::success");
    console.log(model);
    var detect_timer = setInterval(function () {
        video_cap().then(result => {
            detect(model).then(boxes => {
                console.log("detect::success");

                // var hidden_canvas = document.getElementById("HiddenCanvas");
                // var hidden_ctx = hidden_canvas.getContext("2d");

                // for (var box of boxes){
                //     var x = box.left;
                //     var y = box.top;
                //     var w = box.right-box.left;
                //     var h = box.bottom-box.top;
                //     hidden_ctx.rect(x, y, w, h);
                // }
                // hidden_ctx.stroke();

                // var hidden_image = new Image();
                // hidden_image.src = hidden_canvas.toDataURL("image/png");
                // hidden_image.onload = function(){
                //     var video_canvas = document.getElementById("VideoCanvas");
                //     var video_ctx = video_canvas.getContext("2d");

                //     video_canvas.width=hidden_canvas.width;
                //     video_canvas.height=hidden_canvas.height;
                //     video_ctx.drawImage(hidden_image, 0, 0);
                // }

                console.log(boxes);
                detect_num++;
                var d_new = new Date();
                console.log("fps:", 1000 * detect_num / (d_new.getTime() - start_time));
            }, boxes => {
                console.log("detect::failed");
                console.log(boxes);
            });
        });
    }, 10);
}, model => {
    console.log("init_model::failed");
    console.log(model);
});
