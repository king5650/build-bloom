# Equipment and Team Admin Guide

The Equipment and Team pages now load records from Django. Existing hard-coded records remain visible until you finish migrating them.

## Admin URLs

- Admin dashboard: http://localhost:8000/admin/
- Equipment: http://localhost:8000/admin/content/equipment/
- Team members: http://localhost:8000/admin/content/teammember/

## Add Equipment

Create an equipment record with:

- **Name (FR):** French display name
- **Name (EN):** English display name
- **Description (FR):** French description or specifications
- **Description (EN):** English description or specifications
- **Photo:** Optional equipment image

Equipment appears automatically on http://localhost:8080/equipment. Images are served through the backend media URL.

## Add Team Members

Create a team member with:

- **Name:** Full name
- **Role (FR):** French role
- **Role (EN):** English role
- **Bio (FR):** French biography
- **Bio (EN):** English biography
- **Photo:** Optional portrait
- **Order:** Lower numbers appear first

Team members appear automatically on http://localhost:8080/team. If no photo is uploaded, the page displays initials generated from the name.

## Migration Behavior

- API records are displayed first, followed by the existing hard-coded records.
- New admin records do not require a frontend code change.
- After migrating all existing records, the hard-coded `EQUIPMENT` and `TEAM` arrays can be removed from `build-bloom/src/data/site.ts`.
- The API endpoints are `/api/equipment/` and `/api/team/`.

## Verify Changes

1. Add or edit a record in Django admin.
2. Refresh the corresponding frontend page.
3. Confirm the bilingual content changes with the language switcher.
4. Confirm uploaded photos are visible.
