export interface EvalConfig {
  skills: string[];
  query: string;
  files: string[];
  expected_behavior: string[];
  template?: string | false;
}

export interface RunOptions {
  model: string;
  skill?: string;
  baseline: boolean;
  timeout: number;
  verbose: boolean;
  templatePath?: string;
}

export interface RunResult {
  success: boolean;
  buildSuccess: boolean;
  testSuccess: boolean;
  duration: number;
  output: string;
  workDir?: string;
  modelId?: string;
}

export interface TierResult {
  passed: boolean;
  duration: number;
}

export interface ModelResult {
  version?: string;
  timestamp: string;
  tiers: {
    baseline?: TierResult;
    "with-skill"?: TierResult;
    "with-skill-prompt"?: TierResult;
    "with-agents-md"?: TierResult;
  };
}

export interface ResultsFile {
  [model: string]: ModelResult;
}
