"use strict";

/* A half-edge in a doubly connected edge list. A half-edge is a directed edge.
 * An (undirected) edge consists of two symmetric half-edges with opposite
 * directions.
 */
function DCELHalfEdge() {
  this._next = null;
  this._sym = null;
  this._onext = null;
  this._lnext = null;
  this._org = null;
  this._left = null;
}

/* Returns the symmetric of this half-edge, that is the half-edge with the
 * opposite direction as this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "sym", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._sym;
  }
});

/* Returns the next counterclockwise half-edge with the same origin vertex as
 * this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "onext", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._onext;
  }
});

/* Returns the previous counterclockwise half-edge with the same origin vertex
 * as this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "oprev", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.sym.lnext;
  }
});

/* Returns the next counterclockwise half-edge with the same destination vertex
 * as this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "dnext", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.rprev.sym;
  }
});

/* Returns the previous counterclockwise half-edge with the same destination
 * vertex as this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "dprev", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.lnext.sym;
  }
});

/* Returns the next counterclockwise half-edge with the same left face as this
 * half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "lnext", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._lnext;
  }
});

/* Returns the previous counterclockwise half-edge with the same left face as
 * this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "lprev", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.onext.sym;
  }
});

/* Returns the next counterclockwise half-edge with the same right face as this
 * half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "rnext", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.oprev.sym;
  }
});

/* Returns the previous counterclockwise half-edge with the same right face as
 * this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "rprev", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.sym.onext;
  }
});

/* Returns the origin vertex of this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "org", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._org;
  }
});

/* Returns the destination vertex of this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "dest", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.sym.org;
  }
});

/* Returns the left face of this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "left", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._left;
  }
});

/* Returns the right face of this half-edge.
 */
Object.defineProperty(DCELHalfEdge.prototype, "right", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.sym.left;
  }
});

/* A vertex in a doubly connected edge list.
 */
function DCELVertex(edge) {
  this._next = null;
  this._prev = null;
  this._edge = edge;
}

/* Returns a half-edge with this vertex as its origin vertex.
 */
Object.defineProperty(DCELVertex.prototype, "edge", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._edge;
  }
});

/* A face in a doubly connected edge list.
 */
function DCELFace(edge) {
  this._next = null;
  this._prev = null;
  this._edge = edge;
}

/* Returns a half-edge with this face as its left face.
 */
Object.defineProperty(DCELFace.prototype, "edge", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._edge;
  }
});

/* A doubly connected edge list.
 */
function DCEL() {
  // Initialize the edge list.
  var ehead = new DCELHalfEdge();
  var eheadsym = new DCELHalfEdge();
  ehead._next = ehead;
  ehead._sym = eheadsym;
  eheadsym._next = eheadsym;
  eheadsym._sym = ehead;
  this._ehead = ehead;
  this._eheadsym = eheadsym;

  // Initialize the vertex list.
  var vhead = new DCELVertex(null);
  vhead._next = vhead;
  vhead._prev = vhead;
  this._vhead = vhead;

  // Initialize the face list.
  var fhead = new DCELFace(null);
  fhead._next = fhead;
  fhead._prev = fhead;
  this._fhead = fhead;
}

/* Returns an iterator to the edges in this doubly connected edge list.
 */
Object.defineProperty(DCEL.prototype, "edges", {
  configurable: true,
  enumerable: true,
  get: function () {
    var ehead = this._ehead;
    var e = ehead._next;
    return {
      next: function () {
        if (e === ehead) {
          return { done: true };
        }
        else {
          var value = e;
          e = e._next;
          return { done: false, value: value };
        }
      }
    };
  }
});

/* Returns an iterator to the vertices in this doubly connected edge list.
 */
Object.defineProperty(DCEL.prototype, "vertices", {
  configurable: true,
  enumerable: true,
  get: function () {
    var vhead = this._vhead;
    var v = vhead._next;
    return {
      next: function () {
        if (v === vhead) {
          return { done: true };
        }
        else {
          var value = v;
          v = v._next;
          return { done: false, value: value };
        }
      }
    };
  }
});

/* Returns an iterator to the faces in this doubly connected edge list.
 */
Object.defineProperty(DCEL.prototype, "faces", {
  configurable: true,
  enumerable: true,
  get: function () {
    var fhead = this._fhead;
    var f = fhead._next;
    return {
      next: function () {
        if (f === fhead) {
          return { done: true };
        }
        else {
          var value = f;
          f = f._next;
          return { done: false, value: value };
        }
      }
    };
  }
});

/* Adds a new edge to this doubly connected edge list. Returns a half-edge of
 * the new edge.
 */
DCEL.prototype.makeEdge = function () {
  var enew = this._makeEdge();
  this._makeVertex(enew);
  this._makeVertex(enew._sym);
  this._makeFace(enew);
  return enew;
};

/* Given two half-edges `e1` and `e2`, changes the topology of this doubly
 * connected edge list as follows: if `e1` and `e2` have the same origin vertex,
 * splits the vertex into two. Otherwise, joins the vertices into one. If `e1`
 * and `e2` have the same left face, splits the face into two. Otherwise, joins
 * the faces into one.
 */
DCEL.prototype.splice = function (e1, e2) {
  if (e1 === e2) {
    return;
  }

  var joinVertex = false;
  if (e1._org !== e2._org) {
    this._killVertex(e2._org, e1._org);
    joinVertex = true;
  }
  var joinFace = false;
  if (e1._left !== e2._left) {
    this._killFace(e2._left, e1._left);
    joinFace = true;
  }

  this._splice(e1, e2);

  if (!joinVertex) {
    e1._org._edge = e1;
    this._makeVertex(e2);
  }
  if (!joinFace) {
    e1._left._edge = e1;
    this._makeFace(e2);
  }
}

/* Given two half-edges `e1` and `e2`, adds a new edge to this doubly connected
 * edge list that connects the destination vertex of `e1` to the origin vertex
 * of `e2`. If `e1` and `e2` have the same left face, splits the face into two.
 * Otherwise, joins the faces into one. Returns a half-edge of the new edge.
 */
DCEL.prototype.connect = function (e1, e2) {
  var enew = this._makeEdge();
  var enewsym = enew._sym;

  var joinFace = false;
  if (e1._left !== e2._left) {
    this._killFace(e2._left, e1._left);
    joinFace = true;
  }

  this._splice(enew, e1._lnext);
  this._splice(enewsym, e2);
  enew._org = e1._sym._org;
  enew._left = e1._left;
  enewsym._org = e2._org;
  enewsym._left = e2._left;

  if (!joinFace) {
    enew._left._edge = enew;
    this._makeFace(enewsym);
  }

  return enew;
};

/* Given a half-edge `edel`, removes the edge consisting of `edel` and its
 * symmetric from this doubly connected edge list. If `edel` has the same left
 * and right face, splits the face into two. Otherwise, joins the faces into
 * one.
 */
DCEL.prototype.deleteEdge = function (edel) {
  var edelsym = edel._sym;

  if (edel._onext === edel) {
    this._killVertex(edel._org, null);
  }
  else {
    var joinFace = false;
    if (edel._left !== edelsym._left) {
      this._killFace(edelsym._left, edel._left);
      joinFace = true;
    }

    edel._org._edge = edel._onext;
    edelsym._left._edge = edelsym._lnext;
    this._splice(edel, edelsym._lnext);

    if (!joinFace) {
      this._makeFace(edel);
    }
  }

  if (edelsym._onext === edelsym) {
    this._killVertex(edelsym._org, null);
    this._killFace(edelsym._left, null);
  }
  else {
    edelsym._org._edge = edelsym._onext;
    edel._left._edge = edel._lnext;
    this._splice(edelsym, edel._lnext);
  }

  this._killEdge(edel);
};

/* Given a half-edge `e`, adds a new edge to this doubly connected edge list
 * such that its origin vertex is the destination vertex of `e`, and its 
 * destination vertex is a new vertex.
 */
DCEL.prototype.addEdgeVertex = function (e) {
  var enew = this._makeEdge();
  var enewsym = enew._sym;
  this._splice(enew, e._lnext);

  enew._org = e._sym._org;
  enew._left = e._left;
  this._makeVertex(enewsym);
  enewsym._left = e._left;

  return enew;
};

/* Given a half-edge `e`, splits `e` into two edges `e` and `enew`, such
 * that the origin vertex of `enew` is the new destination vertex of `e`, and
 * the destination vertex of `enew` is the old destination vertex of `e`.
 */
DCEL.prototype.splitEdge = function (e) {
  var enew = this.addEdgeVertex(e);
  this._splice(e._sym, e._lnext);
  this._splice(e._sym, enew._sym);

  e._sym._org = enew._sym._org;
  enew._org._edge = enew;
  enew._left = e._sym._left;

  return enew._sym;
};

DCEL.prototype._makeEdge = function () {
  var enew = new DCELHalfEdge();
  var enewsym = new DCELHalfEdge();
  enew._sym = enewsym;
  enew._onext = enew;
  enew._lnext = enewsym;
  enewsym._sym = enew;
  enewsym._onext = enewsym;
  enewsym._lnext = enew;

  var enext = this._ehead;
  var eprev = enext._sym._next;
  enew._next = enext;
  enext._sym._next = enewsym;
  enewsym._next = eprev;
  eprev._sym._next = enew;

  return enew;
};

DCEL.prototype._killEdge = function (edel) {
  var enext = edel._next;
  var eprev = edel._sym._next;
  enext._sym._next = eprev;
  eprev._sym._next = enext;
}

DCEL.prototype._makeVertex = function (edge) {
  var vnew = new DCELVertex(edge);
  var vnext = this._vhead;
  var vprev = vnext._prev;

  vnew._next = vnext;
  vnext._prev = vnew;
  vnew._prev = vprev;
  vprev._next = vnew;

  var e = edge;
  do {
    e._org = vnew;
    e = e._onext;
  }
  while (e !== edge);
};

DCEL.prototype._killVertex = function (vdel, vnew) {
  var edge = vdel.edge;
  var e = edge;
  do {
    e._org = vnew;
    e = e._onext;
  }
  while (e !== edge);

  var vnext = vdel._next;
  var vprev = vdel._prev;
  vnext._prev = vprev;
  vprev._next = vnext;
};

DCEL.prototype._makeFace = function (edge) {
  var fnew = new DCELFace(edge);
  var fnext = this._fhead;
  var fprev = fnext._prev;

  fnew._next = fnext;
  fnext._prev = fnew;
  fnew._prev = fprev;
  fprev._next = fnew;

  var e = edge;
  do {
    e._left = fnew;
    e = e._lnext;
  }
  while (e !== edge);
};

DCEL.prototype._killFace = function (fdel, fnew) {
  var edge = fdel.edge;
  var e = edge;
  do {
    e._left = fnew;
    e = e._lnext;
  }
  while (e !== edge);

  var fnext = fdel._next;
  var fprev = fdel._prev;
  fnext._prev = fprev;
  fprev._next = fnext;
};

DCEL.prototype._splice = function (e1, e2) {
  var e1onext = e1._onext;
  var e2onext = e2._onext;
  e1._onext = e2onext;
  e2onext._sym._lnext = e1;
  e2._onext = e1onext;
  e1onext._sym._lnext = e2;
};

exports.DCEL = DCEL;
