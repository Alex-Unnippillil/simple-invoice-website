# simple-invoice-website
Basic rent invoicing system that records payments and generates printable/PDF rent receipts.

## Notifications

The project includes a simple notification scheduler (`notifications.py`) that
stores a user's time zone and quiet-hour preferences and returns an adjusted
send time that respects those preferences.
