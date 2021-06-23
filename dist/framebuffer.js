"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.bindFramebuffer = exports.createFramebuffer = exports.bindTexture = exports.loadTexture = exports.createTexture = exports.createDepthTexture = exports.clearDepth = exports.clearColor = exports.Framebuffer = void 0;
var main_1 = require("./main");
var Framebuffer = /** @class */ (function () {
    function Framebuffer(fb, width, height) {
        this.fb = fb;
        this.width = width;
        this.height = height;
    }
    Framebuffer.prototype.bind = function () {
        bindFramebuffer(this.fb);
        main_1.gl.viewport(0, 0, this.width, this.height);
    };
    return Framebuffer;
}());
exports.Framebuffer = Framebuffer;
function clearColor(color) {
    main_1.gl.clearColor(color[0], color[1], color[2], color[3]);
    main_1.gl.clear(main_1.gl.COLOR_BUFFER_BIT);
}
exports.clearColor = clearColor;
function clearDepth(depth) {
    if (depth === void 0) { depth = 0.0; }
    main_1.gl.clearDepth(depth);
    main_1.gl.clear(main_1.gl.DEPTH_BUFFER_BIT);
}
exports.clearDepth = clearDepth;
function createDepthTexture(width, height) {
    var tex = main_1.gl.createTexture();
    bindTexture(tex);
    var data = null;
    main_1.gl.texImage2D(main_1.gl.TEXTURE_2D, 0, main_1.gl.DEPTH_COMPONENT, width, height, 0, main_1.gl.DEPTH_COMPONENT, main_1.gl.UNSIGNED_BYTE, data);
    // Set the filtering so we don't need mips
    main_1.gl.texParameteri(main_1.gl.TEXTURE_2D, main_1.gl.TEXTURE_MIN_FILTER, main_1.gl.LINEAR);
    main_1.gl.texParameteri(main_1.gl.TEXTURE_2D, main_1.gl.TEXTURE_WRAP_S, main_1.gl.CLAMP_TO_EDGE);
    main_1.gl.texParameteri(main_1.gl.TEXTURE_2D, main_1.gl.TEXTURE_WRAP_T, main_1.gl.CLAMP_TO_EDGE);
    return tex;
}
exports.createDepthTexture = createDepthTexture;
function createTexture(width, height, data) {
    var tex = main_1.gl.createTexture();
    bindTexture(tex);
    main_1.gl.texImage2D(main_1.gl.TEXTURE_2D, 0, main_1.gl.RGBA, width, height, 0, main_1.gl.RGBA, main_1.gl.UNSIGNED_BYTE, data); // @ts-ignore
    // Set the filtering so we don't need mips
    main_1.gl.texParameteri(main_1.gl.TEXTURE_2D, main_1.gl.TEXTURE_MIN_FILTER, main_1.gl.LINEAR);
    main_1.gl.texParameteri(main_1.gl.TEXTURE_2D, main_1.gl.TEXTURE_WRAP_S, main_1.gl.CLAMP_TO_EDGE);
    main_1.gl.texParameteri(main_1.gl.TEXTURE_2D, main_1.gl.TEXTURE_WRAP_T, main_1.gl.CLAMP_TO_EDGE);
    return tex;
}
exports.createTexture = createTexture;
function loadTexture(url) {
    return __awaiter(this, void 0, void 0, function () {
        var img, tex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    img = new Image();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            img.src = url;
                            img.onload = resolve;
                        })];
                case 1:
                    _a.sent();
                    tex = createTexture(img.width, img.height, img);
                    return [2 /*return*/];
            }
        });
    });
}
exports.loadTexture = loadTexture;
function bindTexture(tex) {
    main_1.gl.bindTexture(main_1.gl.TEXTURE_2D, tex);
}
exports.bindTexture = bindTexture;
function createFramebuffer(width, height) {
    var fb = new Framebuffer(main_1.gl.createFramebuffer(), width, height);
    bindFramebuffer(fb.fb);
    var tex = createTexture(width, height);
    main_1.gl.framebufferTexture2D(main_1.gl.FRAMEBUFFER, main_1.gl.COLOR_ATTACHMENT0, main_1.gl.TEXTURE_2D, tex, 0);
    return fb;
}
exports.createFramebuffer = createFramebuffer;
function bindFramebuffer(fb) {
    main_1.gl.bindFramebuffer(main_1.gl.FRAMEBUFFER, fb);
}
exports.bindFramebuffer = bindFramebuffer;
// vim: ts=2 sts=2 sw=2 noexpandtab
