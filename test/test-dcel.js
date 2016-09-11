"use strict";

var DCEL = require("../lib/dcel").DCEL;
var assert = require("assert");

describe("DCEL", function () {
  describe("edges", function () {
    it("should iterate over all edges", function () {
      var dcel = new DCEL();
      var length = 10;
      var es = new Array(length);
      for (var index = 0; index < length; index += 1) {
        es[index] = dcel.makeEdge();
      }

      var iterator = dcel.edges;
      var result = iterator.next();
      for (var index = 0; index < length; index += 1) {
        assert.strictEqual(result.done, false);
        assert.strictEqual(result.value, es[index]);
        result = iterator.next();
      }
      assert.strictEqual(result.done, true);
    });
  });
  describe("vertices", function () {
    it("should iterate over all vertices", function () {
      var dcel = new DCEL();
      var length = 10;
      var es = new Array(length);
      for (var index = 0; index < length; index += 1) {
        es[index] = dcel.makeEdge();
      }

      var iterator = dcel.vertices;
      var result = iterator.next();
      for (var index = 0; index < length; index += 1) {
        assert.strictEqual(result.done, false);
        assert.strictEqual(result.value, es[index].org);
        result = iterator.next();
        assert.strictEqual(result.done, false);
        assert.strictEqual(result.value, es[index].dest);
        result = iterator.next();
      }
      assert.strictEqual(result.done, true);
    });
  });
  describe("faces", function () {
    it("should iterate over all faces", function () {
      var dcel = new DCEL();
      var length = 10;
      var es = new Array(length);
      for (var index = 0; index < length; index += 1) {
        es[index] = dcel.makeEdge();
      }

      var iterator = dcel.faces;
      var result = iterator.next();
      for (var index = 0; index < length; index += 1) {
        assert.strictEqual(result.done, false);
        assert.strictEqual(result.value, es[index].left);
        result = iterator.next();
      }
      assert.strictEqual(result.done, true);
    });
  });
  describe("makeEdge", function () {
    it("should make edge", function () {
      var dcel = new DCEL();
      var e = dcel.makeEdge();

      assert.strictEqual(e.onext, e);
      assert.strictEqual(e.oprev, e);
      assert.strictEqual(e.dnext, e);
      assert.strictEqual(e.dprev, e);
      assert.strictEqual(e.lnext, e.sym);
      assert.strictEqual(e.lprev, e.sym);
      assert.strictEqual(e.rnext, e.sym);
      assert.strictEqual(e.rprev, e.sym);
      assert.strictEqual(e.org.edge.org, e.org);
      assert.strictEqual(e.dest.edge.org, e.dest);
      assert.strictEqual(e.left.edge.left, e.left);
      assert.strictEqual(e.right.edge.left, e.right);
    });
  });
  describe("splice", function () {
    it("should not have any effect", function () {
      var dcel = new DCEL();
      var e = dcel.makeEdge();
      dcel.splice(e, e);

      assert.strictEqual(e.onext, e);
      assert.strictEqual(e.oprev, e);
      assert.strictEqual(e.dnext, e);
      assert.strictEqual(e.dprev, e);
      assert.strictEqual(e.lnext, e.sym);
      assert.strictEqual(e.lprev, e.sym);
      assert.strictEqual(e.rnext, e.sym);
      assert.strictEqual(e.rprev, e.sym);
      assert.strictEqual(e.org.edge.org, e.org);
      assert.strictEqual(e.dest.edge.org, e.dest);
      assert.strictEqual(e.left.edge.left, e.left);
      assert.strictEqual(e.right.edge.left, e.right);
    }),
    it("should join vertices and split face of same edge", function () {
      var dcel = new DCEL();
      var e = dcel.makeEdge();
      dcel.splice(e, e.sym);

      assert.strictEqual(e.onext, e.sym);
      assert.strictEqual(e.oprev, e.sym);
      assert.strictEqual(e.lnext, e);
      assert.strictEqual(e.lprev, e);
      assert.strictEqual(e.rnext, e);
      assert.strictEqual(e.rprev, e);
      assert.strictEqual(e.org.edge.org, e.org);
      assert.strictEqual(e.dest.edge.org, e.dest);
      assert.strictEqual(e.left.edge.left, e.left);
      assert.strictEqual(e.right.edge.left, e.right);
    });
    it("should split vertex and join faces of same edge", function () {
      var dcel = new DCEL();
      var e = dcel.makeEdge();
      dcel.splice(e, e.sym);
      dcel.splice(e, e.sym);

      assert.strictEqual(e.onext, e);
      assert.strictEqual(e.oprev, e);
      assert.strictEqual(e.dnext, e);
      assert.strictEqual(e.dprev, e);
      assert.strictEqual(e.lnext, e.sym);
      assert.strictEqual(e.lprev, e.sym);
      assert.strictEqual(e.rnext, e.sym);
      assert.strictEqual(e.rprev, e.sym);
      assert.strictEqual(e.org.edge.org, e.org);
      assert.strictEqual(e.dest.edge.org, e.dest);
      assert.strictEqual(e.left.edge.left, e.left);
      assert.strictEqual(e.right.edge.left, e.right);
    });
    it("should join vertices and faces of different edges", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      dcel.splice(e1, e2);

      assert.strictEqual(e1.onext, e2);
      assert.strictEqual(e1.oprev, e2);
      assert.strictEqual(e1.dnext, e1);
      assert.strictEqual(e1.dprev, e1);
      assert.strictEqual(e1.lnext, e1.sym);
      assert.strictEqual(e1.lprev, e2.sym);
      assert.strictEqual(e1.rnext, e2.sym);
      assert.strictEqual(e1.rprev, e1.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e1);
      assert.strictEqual(e2.oprev, e1);
      assert.strictEqual(e2.dnext, e2);
      assert.strictEqual(e2.dprev, e2);
      assert.strictEqual(e2.lnext, e2.sym);
      assert.strictEqual(e2.lprev, e1.sym);
      assert.strictEqual(e2.rnext, e1.sym);
      assert.strictEqual(e2.rprev, e2.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);
    });
    it("should split vertex and face of different edges", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      dcel.splice(e1, e2);
      dcel.splice(e1, e2);

      assert.strictEqual(e1.onext, e1);
      assert.strictEqual(e1.oprev, e1);
      assert.strictEqual(e1.dnext, e1);
      assert.strictEqual(e1.dprev, e1);
      assert.strictEqual(e1.lnext, e1.sym);
      assert.strictEqual(e1.lprev, e1.sym);
      assert.strictEqual(e1.rnext, e1.sym);
      assert.strictEqual(e1.rprev, e1.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e2);
      assert.strictEqual(e2.oprev, e2);
      assert.strictEqual(e2.dnext, e2);
      assert.strictEqual(e2.dprev, e2);
      assert.strictEqual(e2.lnext, e2.sym);
      assert.strictEqual(e2.lprev, e2.sym);
      assert.strictEqual(e2.rnext, e2.sym);
      assert.strictEqual(e2.rprev, e2.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);
    });
    it("should join vertices and split face of different edges", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      dcel.splice(e1, e2);
      dcel.splice(e1.sym, e2.sym);

      assert.strictEqual(e1.onext, e2);
      assert.strictEqual(e1.oprev, e2);
      assert.strictEqual(e1.dnext, e2);
      assert.strictEqual(e1.dprev, e2);
      assert.strictEqual(e1.lnext, e2.sym);
      assert.strictEqual(e1.lprev, e2.sym);
      assert.strictEqual(e1.rnext, e2.sym);
      assert.strictEqual(e1.rprev, e2.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e1);
      assert.strictEqual(e2.oprev, e1);
      assert.strictEqual(e2.dnext, e1);
      assert.strictEqual(e2.dprev, e1);
      assert.strictEqual(e2.lnext, e1.sym);
      assert.strictEqual(e2.lprev, e1.sym);
      assert.strictEqual(e2.rnext, e1.sym);
      assert.strictEqual(e2.rprev, e1.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);
    });
    it("should split vertices and join face of different edges", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      dcel.splice(e1, e2);
      dcel.splice(e1.sym, e2.sym);
      dcel.splice(e1.sym, e2.sym);

      assert.strictEqual(e1.onext, e2);
      assert.strictEqual(e1.oprev, e2);
      assert.strictEqual(e1.dnext, e1);
      assert.strictEqual(e1.dprev, e1);
      assert.strictEqual(e1.lnext, e1.sym);
      assert.strictEqual(e1.lprev, e2.sym);
      assert.strictEqual(e1.rnext, e2.sym);
      assert.strictEqual(e1.rprev, e1.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e1);
      assert.strictEqual(e2.oprev, e1);
      assert.strictEqual(e2.dnext, e2);
      assert.strictEqual(e2.dprev, e2);
      assert.strictEqual(e2.lnext, e2.sym);
      assert.strictEqual(e2.lprev, e1.sym);
      assert.strictEqual(e2.rnext, e1.sym);
      assert.strictEqual(e2.rprev, e2.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);
    });
    it("should connect vertices of different faces", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      var e3 = dcel.makeEdge();
      dcel.splice(e3, e1.lnext);
      dcel.splice(e3.sym, e2);

      assert.strictEqual(e1.onext, e1);
      assert.strictEqual(e1.oprev, e1);
      assert.strictEqual(e1.dnext, e3.sym);
      assert.strictEqual(e1.dprev, e3.sym);
      assert.strictEqual(e1.lnext, e3);
      assert.strictEqual(e1.lprev, e1.sym);
      assert.strictEqual(e1.rnext, e1.sym);
      assert.strictEqual(e1.rprev, e3);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e3.sym);
      assert.strictEqual(e2.oprev, e3.sym);
      assert.strictEqual(e2.dnext, e2);
      assert.strictEqual(e2.dprev, e2);
      assert.strictEqual(e2.lnext, e2.sym);
      assert.strictEqual(e2.lprev, e3);
      assert.strictEqual(e2.rnext, e3);
      assert.strictEqual(e2.rprev, e2.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);

      assert.strictEqual(e3.onext, e1.sym);
      assert.strictEqual(e3.oprev, e1.sym);
      assert.strictEqual(e3.dnext, e2.sym);
      assert.strictEqual(e3.dprev, e2.sym);
      assert.strictEqual(e3.lnext, e2);
      assert.strictEqual(e3.lprev, e1);
      assert.strictEqual(e3.rnext, e1);
      assert.strictEqual(e3.rprev, e2);
      assert.strictEqual(e3.org.edge.org, e3.org);
      assert.strictEqual(e3.dest.edge.org, e3.dest);
      assert.strictEqual(e3.left.edge.left, e3.left);
      assert.strictEqual(e3.right.edge.left, e3.right);
    });
    it("should connect vertices of same face", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      var e3 = dcel.makeEdge();
      dcel.splice(e3, e1.lnext);
      dcel.splice(e3.sym, e2);
      dcel.splice(e3, e3.sym.lnext);
      dcel.splice(e3.sym, e3.lnext);

      assert.strictEqual(e1.onext, e1);
      assert.strictEqual(e1.oprev, e1);
      assert.strictEqual(e1.dnext, e1);
      assert.strictEqual(e1.dprev, e1);
      assert.strictEqual(e1.lnext, e1.sym);
      assert.strictEqual(e1.lprev, e1.sym);
      assert.strictEqual(e1.rnext, e1.sym);
      assert.strictEqual(e1.rprev, e1.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e2);
      assert.strictEqual(e2.oprev, e2);
      assert.strictEqual(e2.dnext, e2);
      assert.strictEqual(e2.dprev, e2);
      assert.strictEqual(e2.lnext, e2.sym);
      assert.strictEqual(e2.lprev, e2.sym);
      assert.strictEqual(e2.rnext, e2.sym);
      assert.strictEqual(e2.rprev, e2.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);

      assert.strictEqual(e3.onext, e3);
      assert.strictEqual(e3.oprev, e3);
      assert.strictEqual(e3.dnext, e3);
      assert.strictEqual(e3.dprev, e3);
      assert.strictEqual(e3.lnext, e3.sym);
      assert.strictEqual(e3.lprev, e3.sym);
      assert.strictEqual(e3.rnext, e3.sym);
      assert.strictEqual(e3.rprev, e3.sym);
      assert.strictEqual(e3.org.edge.org, e3.org);
      assert.strictEqual(e3.dest.edge.org, e3.dest);
      assert.strictEqual(e3.left.edge.left, e3.left);
      assert.strictEqual(e3.right.edge.left, e3.right);
    });
    it("should disconnect edge with same left and right face", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      dcel.splice(e1, e2);
      dcel.splice(e1.sym, e2.sym);
      var e3 = dcel.makeEdge();
      dcel.splice(e3, e2.sym.lnext);
      dcel.splice(e3.sym, e2.sym);

      assert.strictEqual(e1.onext, e3);
      assert.strictEqual(e1.oprev, e2);
      assert.strictEqual(e1.dnext, e2);
      assert.strictEqual(e1.dprev, e3);
      assert.strictEqual(e1.lnext, e3.sym);
      assert.strictEqual(e1.lprev, e3.sym);
      assert.strictEqual(e1.rnext, e2.sym);
      assert.strictEqual(e1.rprev, e2.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e1);
      assert.strictEqual(e2.oprev, e3);
      assert.strictEqual(e2.dnext, e3);
      assert.strictEqual(e2.dprev, e1);
      assert.strictEqual(e2.lnext, e1.sym);
      assert.strictEqual(e2.lprev, e1.sym);
      assert.strictEqual(e2.rnext, e3.sym);
      assert.strictEqual(e2.rprev, e3.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);

      assert.strictEqual(e3.onext, e2);
      assert.strictEqual(e3.oprev, e1);
      assert.strictEqual(e3.dnext, e1);
      assert.strictEqual(e3.dprev, e2);
      assert.strictEqual(e3.lnext, e2.sym);
      assert.strictEqual(e3.lprev, e2.sym);
      assert.strictEqual(e3.rnext, e1.sym);
      assert.strictEqual(e3.rprev, e1.sym);
      assert.strictEqual(e3.org.edge.org, e3.org);
      assert.strictEqual(e3.dest.edge.org, e3.dest);
      assert.strictEqual(e3.left.edge.left, e3.left);
      assert.strictEqual(e3.right.edge.left, e3.right);
    });
    it("should disconnect edge with different left and right faces", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      dcel.splice(e1, e2);
      dcel.splice(e1.sym, e2.sym);
      var e3 = dcel.connect(e2.sym, e2.sym);
      dcel.splice(e3, e3.sym.lnext);
      dcel.splice(e3.sym, e3.lnext);

      assert.strictEqual(e1.onext, e2);
      assert.strictEqual(e1.oprev, e2);
      assert.strictEqual(e1.dnext, e2);
      assert.strictEqual(e1.dprev, e2);
      assert.strictEqual(e1.lnext, e2.sym);
      assert.strictEqual(e1.lprev, e2.sym);
      assert.strictEqual(e1.rnext, e2.sym);
      assert.strictEqual(e1.rprev, e2.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e1);
      assert.strictEqual(e2.oprev, e1);
      assert.strictEqual(e2.dnext, e1);
      assert.strictEqual(e2.dprev, e1);
      assert.strictEqual(e2.lnext, e1.sym);
      assert.strictEqual(e2.lprev, e1.sym);
      assert.strictEqual(e2.rnext, e1.sym);
      assert.strictEqual(e2.rprev, e1.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);

      assert.strictEqual(e3.onext, e3);
      assert.strictEqual(e3.oprev, e3);
      assert.strictEqual(e3.dnext, e3);
      assert.strictEqual(e3.dprev, e3);
      assert.strictEqual(e3.lnext, e3.sym);
      assert.strictEqual(e3.lprev, e3.sym);
      assert.strictEqual(e3.rnext, e3.sym);
      assert.strictEqual(e3.rprev, e3.sym);
      assert.strictEqual(e3.org.edge.org, e3.org);
      assert.strictEqual(e3.dest.edge.org, e3.dest);
      assert.strictEqual(e3.left.edge.left, e3.left);
      assert.strictEqual(e3.right.edge.left, e3.right);
    });
  });
  describe("connect", function () {
    it("should connect vertices of different faces", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      var e3 = dcel.connect(e1, e2);

      assert.strictEqual(e1.onext, e1);
      assert.strictEqual(e1.oprev, e1);
      assert.strictEqual(e1.dnext, e3.sym);
      assert.strictEqual(e1.dprev, e3.sym);
      assert.strictEqual(e1.lnext, e3);
      assert.strictEqual(e1.lprev, e1.sym);
      assert.strictEqual(e1.rnext, e1.sym);
      assert.strictEqual(e1.rprev, e3);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e3.sym);
      assert.strictEqual(e2.oprev, e3.sym);
      assert.strictEqual(e2.dnext, e2);
      assert.strictEqual(e2.dprev, e2);
      assert.strictEqual(e2.lnext, e2.sym);
      assert.strictEqual(e2.lprev, e3);
      assert.strictEqual(e2.rnext, e3);
      assert.strictEqual(e2.rprev, e2.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);

      assert.strictEqual(e3.onext, e1.sym);
      assert.strictEqual(e3.oprev, e1.sym);
      assert.strictEqual(e3.dnext, e2.sym);
      assert.strictEqual(e3.dprev, e2.sym);
      assert.strictEqual(e3.lnext, e2);
      assert.strictEqual(e3.lprev, e1);
      assert.strictEqual(e3.rnext, e1);
      assert.strictEqual(e3.rprev, e2);
      assert.strictEqual(e3.org.edge.org, e3.org);
      assert.strictEqual(e3.dest.edge.org, e3.dest);
      assert.strictEqual(e3.left.edge.left, e3.left);
      assert.strictEqual(e3.right.edge.left, e3.right);
    });
    it("should connect vertices of same face", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      dcel.splice(e1, e2);
      dcel.splice(e1.sym, e2.sym);
      var e3 = dcel.connect(e2.sym, e2.sym);

      assert.strictEqual(e1.onext, e3);
      assert.strictEqual(e1.oprev, e2);
      assert.strictEqual(e1.dnext, e2);
      assert.strictEqual(e1.dprev, e3);
      assert.strictEqual(e1.lnext, e3.sym);
      assert.strictEqual(e1.lprev, e3.sym);
      assert.strictEqual(e1.rnext, e2.sym);
      assert.strictEqual(e1.rprev, e2.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e1);
      assert.strictEqual(e2.oprev, e3);
      assert.strictEqual(e2.dnext, e3);
      assert.strictEqual(e2.dprev, e1);
      assert.strictEqual(e2.lnext, e1.sym);
      assert.strictEqual(e2.lprev, e1.sym);
      assert.strictEqual(e2.rnext, e3.sym);
      assert.strictEqual(e2.rprev, e3.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);

      assert.strictEqual(e3.onext, e2);
      assert.strictEqual(e3.oprev, e1);
      assert.strictEqual(e3.dnext, e1);
      assert.strictEqual(e3.dprev, e2);
      assert.strictEqual(e3.lnext, e2.sym);
      assert.strictEqual(e3.lprev, e2.sym);
      assert.strictEqual(e3.rnext, e1.sym);
      assert.strictEqual(e3.rprev, e1.sym);
      assert.strictEqual(e3.org.edge.org, e3.org);
      assert.strictEqual(e3.dest.edge.org, e3.dest);
      assert.strictEqual(e3.left.edge.left, e3.left);
      assert.strictEqual(e3.right.edge.left, e3.right);
    });
  });
  describe("deleteEdge", function () {
    it("should delete edge with same left and right face", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      var e3 = dcel.connect(e1, e2);
      dcel.deleteEdge(e3);

      assert.strictEqual(e1.onext, e1);
      assert.strictEqual(e1.oprev, e1);
      assert.strictEqual(e1.dnext, e1);
      assert.strictEqual(e1.dprev, e1);
      assert.strictEqual(e1.lnext, e1.sym);
      assert.strictEqual(e1.lprev, e1.sym);
      assert.strictEqual(e1.rnext, e1.sym);
      assert.strictEqual(e1.rprev, e1.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e2);
      assert.strictEqual(e2.oprev, e2);
      assert.strictEqual(e2.dnext, e2);
      assert.strictEqual(e2.dprev, e2);
      assert.strictEqual(e2.lnext, e2.sym);
      assert.strictEqual(e2.lprev, e2.sym);
      assert.strictEqual(e2.rnext, e2.sym);
      assert.strictEqual(e2.rprev, e2.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);
    });
    it("should delete edge with different left and right faces", function () {
      var dcel = new DCEL();
      var e1 = dcel.makeEdge();
      var e2 = dcel.makeEdge();
      dcel.splice(e1, e2);
      dcel.splice(e1.sym, e2.sym);
      var e3 = dcel.connect(e2.sym, e2.sym);
      dcel.deleteEdge(e3);

      assert.strictEqual(e1.onext, e2);
      assert.strictEqual(e1.oprev, e2);
      assert.strictEqual(e1.dnext, e2);
      assert.strictEqual(e1.dprev, e2);
      assert.strictEqual(e1.lnext, e2.sym);
      assert.strictEqual(e1.lprev, e2.sym);
      assert.strictEqual(e1.rnext, e2.sym);
      assert.strictEqual(e1.rprev, e2.sym);
      assert.strictEqual(e1.org.edge.org, e1.org);
      assert.strictEqual(e1.dest.edge.org, e1.dest);
      assert.strictEqual(e1.left.edge.left, e1.left);
      assert.strictEqual(e1.right.edge.left, e1.right);

      assert.strictEqual(e2.onext, e1);
      assert.strictEqual(e2.oprev, e1);
      assert.strictEqual(e2.dnext, e1);
      assert.strictEqual(e2.dprev, e1);
      assert.strictEqual(e2.lnext, e1.sym);
      assert.strictEqual(e2.lprev, e1.sym);
      assert.strictEqual(e2.rnext, e1.sym);
      assert.strictEqual(e2.rprev, e1.sym);
      assert.strictEqual(e2.org.edge.org, e2.org);
      assert.strictEqual(e2.dest.edge.org, e2.dest);
      assert.strictEqual(e2.left.edge.left, e2.left);
      assert.strictEqual(e2.right.edge.left, e2.right);
    });
  });
});
