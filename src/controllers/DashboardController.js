const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async index(request, response) {
    const jobs = await Job.getJobs();
    const profile = await Profile.getProfile();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    // Total de horas por dia de cada Job em progresso
    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      // Ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      // Somando a quantidade de status. Se o resultado de status for "done", ele vai somar +1 ao done, se for "progress", ele vai somar +1 ao progress
      statusCount[status] += 1;

      // Total de horas por dia de cada Job em progresso
      jobTotalHours =
        status == "progress"
          ? jobTotalHours + job["daily-hours"]
          : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    // Quantidade de horas que quero trabalhar (PROFILE)
    // MENOS
    // Quantidade de horas por dia de cada job em progress

    const freeHoursCalc = profile["hours-per-day"] - jobTotalHours;

    return response.render("index", {
      profile: profile,
      jobs: updatedJobs,
      status: statusCount,
      freeHours: freeHoursCalc,
    });
  },
};
