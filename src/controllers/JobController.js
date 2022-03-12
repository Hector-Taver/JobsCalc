const Job = require("../model/Job.js");
const JobUtils = require("../utils/JobUtils.js");
const Profile = require("../model/Profile.js");

module.exports = {
  create(request, response) {
    return response.render("job");
  },

  async save(request, response) {
    await Job.createJob({
      name: request.body.name,
      "daily-hours": request.body["daily-hours"],
      "total-hours": request.body["total-hours"],
      created_at: Date.now(), // Atribuindo a data de hoje
    });

    return response.redirect("/");
  },

  async show(request, response) {
    const jobs = await Job.getJobs();
    const profile = await Profile.getProfile();

    const jobId = request.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return response.send("Job not found!");
    }

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return response.render("job-edit", { job });
  },

  async update(request, response) {
    const jobId = request.params.id;

    const updatedJob = {
      name: request.body.name,
      "total-hours": request.body["total-hours"],
      "daily-hours": request.body["daily-hours"],
    };

    await Job.updateJob(updatedJob, jobId);

    response.redirect("/");
  },

  async delete(request, response) {
    const jobId = request.params.id;

    await Job.deleteJob(jobId);

    return response.redirect("/");
  },
};
