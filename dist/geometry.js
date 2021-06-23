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
exports.renderModel = exports.loadOBJ = exports.bindIndexBuffer = exports.bindBuffer = exports.createIndexBuffer = exports.createBuffer = exports.StaticObject = void 0;
var main_1 = require("./main");
var shaders_1 = require("./shaders");
var webgl_obj_loader_1 = require("webgl-obj-loader");
var gl_matrix_1 = require("gl-matrix");
var StaticObject = /** @class */ (function () {
    function StaticObject() {
        this.models = [];
    }
    StaticObject.prototype.addModel = function (model, pos, rot, scale) {
        this.models.push({ model: model, pos: pos, rot: rot, scale: scale });
    };
    StaticObject.prototype.render = function () {
        var modelMat = gl_matrix_1.mat4.create();
        for (var _i = 0, _a = this.models; _i < _a.length; _i++) {
            var m = _a[_i];
            gl_matrix_1.mat4.identity(modelMat);
            if (m.rot) {
                gl_matrix_1.mat4.rotateZ(modelMat, modelMat, m.rot[2]);
                gl_matrix_1.mat4.rotateX(modelMat, modelMat, m.rot[0]);
                gl_matrix_1.mat4.rotateY(modelMat, modelMat, m.rot[1]);
            }
            if (m.scale) {
                gl_matrix_1.mat4.scale(modelMat, modelMat, m.scale);
            }
            gl_matrix_1.mat4.translate(modelMat, modelMat, m.pos);
            gl_matrix_1.mat4.multiply(modelMat, main_1.worldMat, modelMat);
            shaders_1.setUniformMat(shaders_1.currentShader, 'world', modelMat);
            renderModel(m.model);
        }
    };
    return StaticObject;
}());
exports.StaticObject = StaticObject;
function createBuffer(buffer) {
    var vertexBuf = main_1.gl.createBuffer();
    main_1.gl.bindBuffer(main_1.gl.ARRAY_BUFFER, vertexBuf);
    main_1.gl.bufferData(main_1.gl.ARRAY_BUFFER, new Float32Array(buffer), main_1.gl.STATIC_DRAW);
    return vertexBuf;
}
exports.createBuffer = createBuffer;
function createIndexBuffer(buffer) {
    var indexBuf = main_1.gl.createBuffer();
    main_1.gl.bindBuffer(main_1.gl.ELEMENT_ARRAY_BUFFER, indexBuf);
    main_1.gl.bufferData(main_1.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffer), main_1.gl.STATIC_DRAW);
    return indexBuf;
}
exports.createIndexBuffer = createIndexBuffer;
function bindBuffer(buffer) {
    main_1.gl.bindBuffer(main_1.gl.ARRAY_BUFFER, buffer);
}
exports.bindBuffer = bindBuffer;
function bindIndexBuffer(buffer) {
    main_1.gl.bindBuffer(main_1.gl.ELEMENT_ARRAY_BUFFER, buffer);
}
exports.bindIndexBuffer = bindIndexBuffer;
function loadOBJ(url) {
    return __awaiter(this, void 0, void 0, function () {
        var resp, obj, mesh, model, coord, normal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.text()];
                case 2:
                    obj = _a.sent();
                    mesh = new webgl_obj_loader_1.Mesh(obj);
                    model = {
                        indices: mesh.indices,
                        vertices: mesh.vertices,
                        normals: mesh.vertexNormals
                    };
                    model.iBuffer = createIndexBuffer(model.indices);
                    model.vBuffer = createBuffer(model.vertices);
                    model.nBuffer = createBuffer(model.normals);
                    coord = 0;
                    bindBuffer(model.vBuffer);
                    main_1.gl.vertexAttribPointer(coord, 3, main_1.gl.FLOAT, false, 0, 0);
                    main_1.gl.enableVertexAttribArray(coord);
                    normal = 1;
                    bindBuffer(model.nBuffer);
                    main_1.gl.vertexAttribPointer(normal, 3, main_1.gl.FLOAT, true, 0, 0);
                    main_1.gl.enableVertexAttribArray(normal);
                    return [2 /*return*/, model];
            }
        });
    });
}
exports.loadOBJ = loadOBJ;
function renderModel(model) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            bindIndexBuffer(model.iBuffer);
            bindBuffer(model.vBuffer);
            main_1.gl.vertexAttribPointer(0, 3, main_1.gl.FLOAT, false, 0, 0);
            bindBuffer(model.nBuffer);
            main_1.gl.vertexAttribPointer(1, 3, main_1.gl.FLOAT, true, 0, 0);
            main_1.gl.drawElements(main_1.gl.TRIANGLES, model.indices.length, main_1.gl.UNSIGNED_SHORT, 0);
            return [2 /*return*/];
        });
    });
}
exports.renderModel = renderModel;
// vim: ts=2 sts=2 sw=2 noexpandtab
