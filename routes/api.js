'use strict';
const mongoose = require("mongoose")
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;
const bodyParser = require('body-parser') 

module.exports = function (app) {
  app.use(bodyParser.json()) 
  app.route('/api/issues/:project')

    .get(function (req, res){
      let projectName = req.params.project;
      const {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.query;

      ProjectModel.aggregate([
        { $match: {name: projectName}},
        { $unwind: "$issues"},
        _id != undefined
          ? { $match: {"issue._id": ObjectId(_id)}}
          : { $match: {}},
        open != undefined
          ? { $match: {"issue.open": open }}
          : { $match: {}},
        issue_title != undefined
          ? { $match: {"issue.issue_title": issue_title }}
          : { $match: {}},
        issue_text != undefined
          ? { $match: {"issue.issue_text": issue_text }}
          : { $match: {}},
        created_by != undefined
          ? { $match: {"issue.created_by": created_by }}
          : { $match: {}},
        assigned_to != undefined
          ? { $match: {"issue.assigned_to": assigned_to }}
          : { $match: {}},
        status_text != undefined
          ? { $match: {"issue.status_text": status_text }}
          : { $match: {}},
      ]).exec((err,data)=>{
        if(!data){
          res.json([])
        } else {
          let mappedData = data.map((item)=>item.issues);
          res.json(mappedData);
        }
      });
    })
    
    .post(function (req, res) {
      let project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }
      const newIssue = new IssueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || "",
      });
      ProjectModel.findOne({ name: project }, (err, projectdata) => {
        if (!projectdata) {
          const newProject = new ProjectModel({ name: project });
          newProject.issues.push(newIssue);
          newProject.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
            } else {
              res.json(newIssue);
            }
          });
        } else {
          projectdata.issues.push(newIssue);
          projectdata.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
            } else {
              res.json(newIssue);
            }
          });
        }
      });
    })

    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
