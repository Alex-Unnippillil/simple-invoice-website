# simple-invoice-website

basic rent invoicing system that records payments and generates printable/PDF rent receipts

## Scheduling reports

This demo includes a simple UI for scheduling report emails. Users can specify:

- Report type
- Recipients
- Cron-style frequency
- Time zone

Scheduled jobs generate both PDF and CSV reports and email them to recipients. Schedules can be edited, deleted or individual recipients can opt out.

### Running

```
pip install -r requirements.txt
python app.py
```

Visit `http://localhost:5000/schedules` to manage schedules.
