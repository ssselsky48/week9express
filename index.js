import express from "express"
import bodyParser from "body-parser"
import { createReadStream, writeFileSync } from 'fs';
import crypto from "crypto"
import http from "http"
import appSrc from "./app.js"
import m from 'mongoose'
import UserModel from './User.js';
import puppeteer from 'puppeteer';

const User = UserModel(m);
const app = appSrc(express, bodyParser, createReadStream, writeFileSync, crypto, http, m, User, puppeteer);

try {
    app.listen(process.env.PORT || 4321);
} catch(e) {
    console.log(e.codeName);
}