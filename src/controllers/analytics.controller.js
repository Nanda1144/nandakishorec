'use strict';

const Project = require('../models/project.model');
const Skill = require('../models/skill.model');
const Course = require('../models/course.model');
const AuditLog = require('../models/auditLog.model');
const Frontend = require('../models/frontend.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const [
    totalProjects,
    totalSkills,
    totalCourses,
    totalFrontends,
    loginLogs,
    failedLogins
  ] = await Promise.all([
    Project.countDocuments(),
    Skill.countDocuments(),
    Course.countDocuments(),
    Frontend.countDocuments(),
    AuditLog.find({ action: 'LOGIN_SUCCESS' }).sort({ createdAt: -1 }).limit(10).lean(),
    AuditLog.find({ action: 'LOGIN_FAILED' }).sort({ createdAt: -1 }).limit(10).lean()
  ]);

  // Fake visitors data for demo since we don't have a visitor tracker
  const totalVisitors = Math.floor(Math.random() * 50000) + 10000;

  // Frontend statistics
  const frontends = await Frontend.find().lean();
  const frontendStats = await Promise.all(frontends.map(async (f) => {
    const pCount = await Project.countDocuments({ frontends: f.name });
    return { name: f.name, projects: pCount };
  }));

  const chartData = [
    { name: 'Mon', visitors: 4000, interactions: 2400 },
    { name: 'Tue', visitors: 3000, interactions: 1398 },
    { name: 'Wed', visitors: 2000, interactions: 9800 },
    { name: 'Thu', visitors: 2780, interactions: 3908 },
    { name: 'Fri', visitors: 1890, interactions: 4800 },
    { name: 'Sat', visitors: 2390, interactions: 3800 },
    { name: 'Sun', visitors: 3490, interactions: 4300 },
  ];

  return new ApiResponse(HTTP_STATUS.OK, {
    totals: {
      projects: totalProjects,
      skills: totalSkills,
      courses: totalCourses,
      visitors: totalVisitors,
      frontends: totalFrontends
    },
    logs: {
      success: loginLogs,
      failed: failedLogins
    },
    frontendStats,
    chartData
  }, MESSAGES.SUCCESS).send(res);
});

module.exports = { getDashboardAnalytics };
