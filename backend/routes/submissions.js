const express = require("express");
const { pool } = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Whitelist of insertable columns per table. Keeps arbitrary column/table
// injection impossible: only these tables and these columns are ever
// touched, no matter what the request body contains.
const TABLES = {
  complaints: {
    columns: [
      "full_name", "age", "gender", "phone", "email", "address",
      "contact_mode", "problem_category", "constituency", "mandal_village",
      "location", "problem_description", "supporting_documents",
      "problem_date", "reported_before", "report_details",
      "specific_authority", "similar_issues", "similar_issues_details",
      "auth_name", "auth_phone", "auth_email", "leader_photo",
    ],
  },
  scheme_eligibility: {
    columns: [
      "fullname", "age", "gender", "mobile", "aadhaar", "caste", "marital",
      "disability", "disability_details", "income", "education",
      "employment", "skill_training", "skill_training_details",
      "social_service", "social_service_details", "welfare_member",
      "schemes",
    ],
  },
  volunteers: {
    columns: ["name", "email", "phone", "constituency", "message"],
  },
  grievances: {
    columns: [
      "fullname", "age", "gender", "mobile", "email", "address", "caste",
      "aadhaar", "grievance", "grievance_other", "details", "attachments",
      "political_sensitive", "parties", "anonymous", "opponent_name",
      "opponent_phone", "opponent_details", "previous_complaint",
      "govt_department", "acknowledgement_url", "video_url", "district",
      "mandal", "village",
    ],
  },
  mahila_shakti_registrations: {
    columns: [
      "fullname", "age", "mobile", "email", "address", "district",
      "constituency", "organization", "organization_details",
      "interest_areas", "why_join", "experience", "experience_details",
      "grievance", "declaration",
    ],
  },
  citizen_feedback: {
    columns: [
      "name", "mobile", "area", "roads_condition", "power_issues",
      "water_supply", "drainage_system", "public_transport",
      "infrastructure_satisfaction", "scheme_awareness", "scheme_benefits",
      "scheme_satisfaction", "education_facilities", "education_satisfaction",
      "employment_opportunities", "employment_satisfaction",
      "healthcare_access", "accessibility_satisfaction", "issues_heard",
      "leadership_satisfaction", "priority_issue",
    ],
  },
  social_media_grievances: {
    columns: [
      "fullname", "email", "phone", "location", "platforms",
      "platform_other", "grievance", "action", "file_urls",
      "warrior_options", "updates_options",
    ],
  },
  yuva_shakthi_members: {
    columns: [
      "fullname", "parentname", "dob", "gender", "phone", "email",
      "address", "village", "mandal", "constituency", "district",
      "education", "stream", "occupation", "skills", "interests",
      "interest_other", "why",
    ],
  },
};

const TABLES_WITH_STATUS = new Set([
  "complaints", "scheme_eligibility", "grievances",
  "mahila_shakti_registrations", "social_media_grievances",
]);

function requireValidTable(req, res, next) {
  if (!Object.prototype.hasOwnProperty.call(TABLES, req.params.table)) {
    return res.status(404).json({ error: "Unknown submission type" });
  }
  next();
}

// POST /api/submissions/:table — public, anonymous submissions allowed.
router.post("/:table", requireValidTable, async (req, res) => {
  const table = req.params.table;
  const { columns } = TABLES[table];

  const values = [];
  const insertColumns = [];
  const placeholders = [];
  for (const col of columns) {
    if (Object.prototype.hasOwnProperty.call(req.body, col)) {
      insertColumns.push(col);
      values.push(req.body[col]);
      placeholders.push(`$${values.length}`);
    }
  }
  insertColumns.push("user_id");
  values.push(req.user?.id ?? null);
  placeholders.push(`$${values.length}`);

  try {
    const result = await pool.query(
      `insert into ${table} (${insertColumns.join(", ")})
       values (${placeholders.join(", ")})
       returning id`,
      values
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed" });
  }
});

// GET /api/submissions/:table — admin only.
router.get("/:table", requireValidTable, requireAdmin, async (req, res) => {
  const table = req.params.table;
  const { status, limit = 50, offset = 0 } = req.query;

  const conditions = [];
  const values = [];
  if (status && TABLES_WITH_STATUS.has(table)) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }
  const where = conditions.length ? `where ${conditions.join(" and ")}` : "";

  values.push(Math.min(Number(limit) || 50, 200));
  values.push(Number(offset) || 0);

  const result = await pool.query(
    `select * from ${table} ${where}
     order by submitted_at desc
     limit $${values.length - 1} offset $${values.length}`,
    values
  );
  res.json({ rows: result.rows });
});

// PATCH /api/submissions/:table/:id — admin only, status transitions.
router.patch("/:table/:id", requireValidTable, requireAdmin, async (req, res) => {
  const table = req.params.table;
  if (!TABLES_WITH_STATUS.has(table)) {
    return res.status(400).json({ error: "This submission type has no status field" });
  }
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "status is required" });

  const result = await pool.query(
    `update ${table} set status = $1 where id = $2 returning id, status`,
    [status, req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
});

module.exports = router;
