# ChittyInsight Charter

## Classification
- **Canonical URI**: `chittycanon://core/services/chittyinsight`
- **Tier**: 5 (Application)
- **Organization**: chittyapps
- **Domain**: chittyinsight.chitty.cc

## Mission

Business intelligence and analytics service for the ChittyOS ecosystem.

## Scope

### IS Responsible For
- Business intelligence, analytics, data visualization, reporting

### IS NOT Responsible For
- Identity generation (ChittyID)
- Token provisioning (ChittyAuth)

## Dependencies

| Type | Service | Purpose |
|------|---------|---------|
| Upstream | ChittyAuth | Authentication |

## API Contract

**Base URL**: https://chittyinsight.chitty.cc

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Service health |

## Ownership

| Role | Owner |
|------|-------|
| Service Owner | chittyapps |

## Compliance

- [ ] Registered in ChittyRegister
- [ ] Health endpoint operational at /health
- [ ] CLAUDE.md present
- [ ] CHARTER.md present
- [ ] CHITTY.md present

---
*Charter Version: 1.0.0 | Last Updated: 2026-02-21*