# KubeJS Support KB (Local)

Generated from Discord support export JSON files.

- Source directory: `docs/GPT-Minimal-Context-Fixed/1.20-Support-Exports`
- Tickets indexed: **458**
- Output JSONL: `docs/kubejs-kb/tickets.index.jsonl`

## Schema (JSONL)

Each line is one normalized ticket record with:

- `ticket_id`, `title`, `category`, `exported_at`
- `source_file`, `message_count`, `participant_count`, `participants`
- `question_excerpt`, `answer_excerpt`, `answer_author`, `has_support_answer`
- `tags`

## Top Tags

recipes (220), items (207), events (204), entities (155), blocks (101), worldgen (84), errors (72), tags (62), textures_models (40), compat (36), fluids (31)

## Rebuild

Run:

```bash
python tools/kubejs_kb/build_kb.py
```
