from flask import Flask, Response, render_template, request
from reporting import compute_aging, export_csv, export_pdf, load_invoices

app = Flask(__name__)


@app.route("/aging-report")
def aging_report():
    property_filter = request.args.get("property")
    organization_filter = request.args.get("organization")
    invoices = load_invoices()
    aging, totals = compute_aging(
        invoices,
        property=property_filter,
        organization=organization_filter,
    )

    export = request.args.get("export")
    if export == "csv":
        csv_data = export_csv(aging)
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment; filename=aging_report.csv"},
        )
    if export == "pdf":
        pdf_bytes = export_pdf(aging)
        return Response(
            pdf_bytes,
            mimetype="application/pdf",
            headers={"Content-Disposition": "attachment; filename=aging_report.pdf"},
        )

    return render_template(
        "aging_report.html",
        aging=aging,
        totals=totals,
        property=property_filter,
        organization=organization_filter,
    )


if __name__ == "__main__":
    app.run(debug=True)
