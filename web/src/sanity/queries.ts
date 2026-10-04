import { client } from './client'

// =============================================================================
// GROQ QUERIES
// Each query targets specific Sanity document types and dereferences relationships.
// The projections flatten referenced documents so the API can reason over them.
// =============================================================================

/** Fetch all technologies with their versions */
export const QUERY_TECHNOLOGIES = `*[_type == "technology"] | order(name asc) {
  _id,
  name,
  slug,
  vendor,
  category,
  description,
  "versions": *[_type == "technologyVersion" && technology._ref == ^._id] | order(version desc) {
    _id,
    version,
    releaseDate,
    lifecycleStatus,
    endOfSupport,
    notes
  }
}`

/** Fetch migration data matching source/target technology names */
export const QUERY_MIGRATION = `*[_type == "migration"
  && sourceTechnology->name match $sourceTech
  && targetTechnology->name match $targetTech
][0] {
  _id,
  migrationType,
  "sourceTechName": sourceTechnology->name,
  "sourceVersionStr": sourceVersion->version,
  "targetTechName": targetTechnology->name,
  "targetVersionStr": targetVersion->version,
  prerequisites,
  migrationSteps[] {
    order,
    description,
    prerequisite,
    validation,
    rollback
  },
  validationSteps,
  rollbackSteps,
  riskSummary
}`

/** Fetch dependencies where the given technology is the source */
export const QUERY_DEPENDENCIES = `*[_type == "dependency" && sourceTechnology->name match $techName] {
  _id,
  "sourceTechnology": sourceTechnology->name,
  "targetTechnology": targetTechnology->name,
  "sourceVersion": sourceVersion->version,
  requiredVersion,
  relationship,
  severity,
  notes
}`

/** Fetch changes (breaking, deprecated, etc.) for a given technology */
export const QUERY_CHANGES = `*[_type == "change" && technology->name match $techName] | order(severity desc) {
  _id,
  "technologyName": technology->name,
  "fromVersion": fromVersion->version,
  "toVersion": toVersion->version,
  title,
  description,
  changeType,
  severity,
  affectedFeature,
  migrationAction,
  validationMethod
}`

/** Fetch claims (structured knowledge assertions) mentioning a technology */
export const QUERY_CLAIMS = `*[_type == "claim" && subject match $techName] {
  _id,
  subject,
  attribute,
  value,
  "versionStr": appliesToVersion->version,
  confidence,
  effectiveFrom,
  effectiveUntil,
  "sourceName": source->title,
  "sourceUrl": source->url,
  "sourcePublisher": source->publisher,
  "supersededBy": supersedes->subject,
  "contradictsRef": contradicts->subject
}`

/** Fetch all evidence sources */
export const QUERY_SOURCES = `*[_type == "source"] | order(publishedAt desc) {
  _id,
  title,
  publisher,
  url,
  publishedAt,
  sourceType,
  authority,
  version,
  summary
}`

// =============================================================================
// TYPED RETRIEVAL FUNCTIONS
// Each function calls the Sanity Content Lake via GROQ and returns typed results.
// Errors are caught and logged — callers receive null/[] on failure so the
// API route can fall back to demo data.
// =============================================================================

export interface MigrationData {
  _id: string
  migrationType: string
  sourceTechName: string
  sourceVersionStr: string
  targetTechName: string
  targetVersionStr: string
  prerequisites: string[]
  migrationSteps: Array<{
    order: number
    description: string
    prerequisite?: string
    validation?: string
    rollback?: string
  }>
  validationSteps: string[]
  rollbackSteps: string[]
  riskSummary: string
}

export interface DependencyData {
  _id: string
  sourceTechnology: string
  targetTechnology: string
  sourceVersion?: string
  requiredVersion?: string
  relationship: string
  severity: string
  notes?: string
}

export interface ChangeData {
  _id: string
  technologyName: string
  fromVersion: string
  toVersion: string
  title: string
  description: string
  changeType: string
  severity: string
  affectedFeature?: string
  migrationAction?: string
  validationMethod?: string
}

export interface ClaimData {
  _id: string
  subject: string
  attribute: string
  value: string
  versionStr: string
  confidence: string
  effectiveFrom?: string
  effectiveUntil?: string
  sourceName: string
  sourceUrl?: string
  sourcePublisher?: string
}

export interface SourceData {
  _id: string
  title: string
  publisher: string
  url: string
  publishedAt?: string
  sourceType: string
  authority: string
  version?: string
  summary?: string
}

export async function getTechnologies() {
  try {
    return await client.fetch(QUERY_TECHNOLOGIES)
  } catch (error) {
    console.error('[MigrationLens] Failed to fetch technologies:', error)
    return []
  }
}

export async function getMigrationData(
  sourceTech: string,
  sourceVersion: string,
  targetTech: string,
  targetVersion: string
): Promise<MigrationData | null> {
  try {
    const result = await client.fetch<MigrationData | null>(QUERY_MIGRATION, {
      sourceTech: `*${sourceTech}*`,
      targetTech: `*${targetTech}*`,
    })
    return result
  } catch (error) {
    console.error('[MigrationLens] Failed to fetch migration data:', error)
    return null
  }
}

export async function getDependencies(techName: string): Promise<DependencyData[]> {
  try {
    return await client.fetch<DependencyData[]>(QUERY_DEPENDENCIES, {
      techName: `*${techName}*`,
    })
  } catch (error) {
    console.error('[MigrationLens] Failed to fetch dependencies:', error)
    return []
  }
}

export async function getDependencyData(techName: string): Promise<DependencyData[]> {
  return getDependencies(techName)
}

export async function getChanges(
  techName: string,
  fromVersion?: string,
  toVersion?: string
): Promise<ChangeData[]> {
  try {
    return await client.fetch<ChangeData[]>(QUERY_CHANGES, {
      techName: `*${techName}*`,
    })
  } catch (error) {
    console.error('[MigrationLens] Failed to fetch changes:', error)
    return []
  }
}

export async function getClaims(techName: string): Promise<ClaimData[]> {
  try {
    return await client.fetch<ClaimData[]>(QUERY_CLAIMS, {
      techName: `*${techName}*`,
    })
  } catch (error) {
    console.error('[MigrationLens] Failed to fetch claims:', error)
    return []
  }
}

export async function getClaimData(techName: string): Promise<ClaimData[]> {
  return getClaims(techName)
}

export async function getSources(): Promise<SourceData[]> {
  try {
    return await client.fetch<SourceData[]>(QUERY_SOURCES)
  } catch (error) {
    console.error('[MigrationLens] Failed to fetch sources:', error)
    return []
  }
}
