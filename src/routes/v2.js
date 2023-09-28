'use strict';

const express = require('express');

const bearer = require('../../src/auth/middleware/bearer.js');
const acl = require('../../src/auth/middleware/acl.js');
const router = express.Router();

router.get('/articles', bearer, acl('read'), handleGetAll);
router.get('/articles/:id', bearer, acl('read'), handleGetOne);
router.post('/articles', bearer, acl('create'), handleCreate);
router.put('/articles/:id', bearer, acl('update'), handleUpdate);
router.delete('/articles/:id', bearer, acl('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

module.exports = router;
