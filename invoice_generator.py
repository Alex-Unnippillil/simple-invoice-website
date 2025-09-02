import json
from datetime import datetime, date
import calendar
import argparse
from pathlib import Path

TENANTS_FILE = Path(__file__).with_name("tenants.json")
INVOICES_FILE = Path(__file__).with_name("invoices.json")

def add_month(dt: date) -> date:
    """Return date one month after ``dt``.

    If ``dt`` falls on the last day of the month the returned date will also be
    the last day of the following month, ensuring billing periods line up with
    calendar months.
    """
    year = dt.year + (dt.month // 12)
    month = dt.month % 12 + 1
    last_day_current = calendar.monthrange(dt.year, dt.month)[1]
    last_day_target = calendar.monthrange(year, month)[1]
    if dt.day == last_day_current:
        day = last_day_target
    else:
        day = min(dt.day, last_day_target)
    return date(year, month, day)

def parse_date(text: str) -> date:
    return datetime.strptime(text, "%Y-%m-%d").date()

def date_to_str(d: date) -> str:
    return d.strftime("%Y-%m-%d")

def load_json(path: Path):
    if not path.exists():
        return []
    with open(path) as f:
        return json.load(f)

def save_json(path: Path, data) -> None:
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def generate_invoices(tenant_ids):
    tenants = load_json(TENANTS_FILE)
    tenant_map = {t["id"]: t for t in tenants}
    invoices = load_json(INVOICES_FILE)
    generated = []
    for tid in tenant_ids:
        tenant = tenant_map.get(tid)
        if not tenant:
            print(f"Tenant {tid} not found")
            continue
        last = tenant.get("last_invoice", {})
        last_number = last.get("number", 0)
        last_start = parse_date(last.get("period_start", date.today().strftime("%Y-%m-%d")))
        last_end = parse_date(last.get("period_end", date.today().strftime("%Y-%m-%d")))
        next_start = add_month(last_start)
        next_end = add_month(last_end)
        next_number = last_number + 1
        invoice = {
            "tenant_id": tid,
            "tenant_name": tenant["name"],
            "number": next_number,
            "period_start": date_to_str(next_start),
            "period_end": date_to_str(next_end),
        }
        invoices.append(invoice)
        tenant["last_invoice"] = {
            "number": next_number,
            "period_start": invoice["period_start"],
            "period_end": invoice["period_end"],
        }
        generated.append(invoice)
    save_json(INVOICES_FILE, invoices)
    save_json(TENANTS_FILE, list(tenant_map.values()))
    return generated

def main():
    parser = argparse.ArgumentParser(description="Generate next period invoices for tenants")
    parser.add_argument("--tenants", required=True, help="Comma separated tenant ids")
    args = parser.parse_args()
    ids = [int(t.strip()) for t in args.tenants.split(",") if t.strip()]
    invoices = generate_invoices(ids)
    print(json.dumps(invoices, indent=2))

if __name__ == "__main__":
    main()
