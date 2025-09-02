import json
import os
import uuid

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from flask import Flask, redirect, render_template, request, url_for

from email_utils import send_email
from reporting import generate_csv, generate_pdf

app = Flask(__name__)

DATA_FILE = "schedules.json"

scheduler = BackgroundScheduler()
scheduler.start()


def load_schedules() -> dict:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE) as f:
            return json.load(f)
    return {}


def save_schedules(data: dict) -> None:
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


schedules = load_schedules()


def run_report(job: dict) -> None:
    pdf = generate_pdf(job["report_type"])
    csv = generate_csv(job["report_type"])
    send_email(
        job["recipients"],
        f"{job['report_type']} report",
        "Attached is your requested report.",
        [pdf, csv],
    )


def schedule_job(job: dict) -> None:
    tz = pytz.timezone(job["time_zone"])
    trigger = CronTrigger.from_crontab(job["cron"], timezone=tz)
    scheduler.add_job(run_report, trigger, id=job["id"], args=[job], replace_existing=True)


for job in schedules.values():
    schedule_job(job)


@app.route("/")
def index() -> str:
    return redirect(url_for("list_schedules"))


@app.route("/schedule", methods=["GET", "POST"])
def schedule() -> str:
    if request.method == "POST":
        job_id = str(uuid.uuid4())
        job = {
            "id": job_id,
            "report_type": request.form["report_type"],
            "recipients": [e.strip() for e in request.form["recipients"].split(",") if e.strip()],
            "cron": request.form["cron"],
            "time_zone": request.form["time_zone"],
        }
        schedules[job_id] = job
        save_schedules(schedules)
        schedule_job(job)
        return redirect(url_for("list_schedules"))
    return render_template("schedule.html", job=None)


@app.route("/schedules")
def list_schedules() -> str:
    return render_template("schedules.html", schedules=schedules)


@app.route("/delete/<job_id>")
def delete(job_id: str) -> str:
    job = schedules.pop(job_id, None)
    if job:
        scheduler.remove_job(job_id)
        save_schedules(schedules)
    return redirect(url_for("list_schedules"))


@app.route("/optout/<job_id>", methods=["POST"])
def optout(job_id: str) -> str:
    email = request.form["email"].strip()
    job = schedules.get(job_id)
    if job and email in job["recipients"]:
        job["recipients"].remove(email)
        save_schedules(schedules)
        schedule_job(job)
    return redirect(url_for("list_schedules"))


@app.route("/edit/<job_id>", methods=["GET", "POST"])
def edit(job_id: str) -> str:
    job = schedules.get(job_id)
    if not job:
        return redirect(url_for("list_schedules"))
    if request.method == "POST":
        job.update(
            {
                "report_type": request.form["report_type"],
                "recipients": [e.strip() for e in request.form["recipients"].split(",") if e.strip()],
                "cron": request.form["cron"],
                "time_zone": request.form["time_zone"],
            }
        )
        save_schedules(schedules)
        schedule_job(job)
        return redirect(url_for("list_schedules"))
    return render_template("schedule.html", job=job)


if __name__ == "__main__":
    app.run(debug=True)
