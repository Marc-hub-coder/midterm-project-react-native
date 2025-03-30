import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job } from './Job';

interface JobContextType {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  savedJobs: Job[];
  setSavedJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  appliedJobs: Job[];                             // ✅ Add appliedJobs state
  applyForJob: (job: Job) => void;                // ✅ Add applyForJob function
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);  // ✅ Applied Jobs state

  const saveJob = (job: Job) => {
    const isDuplicate = savedJobs.some((saved) => saved.id === job.id);
    if (!isDuplicate) {
      setSavedJobs((prev) => [...prev, {
        ...job,
        companyLogo: job.companyLogo || '',
      }]);
    }
  };

  const removeJob = (id: string) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== id));
  };

  // ✅ Function to add applied job
  const applyForJob = (job: Job) => {
    const isAlreadyApplied = appliedJobs.some((applied) => applied.id === job.id);
    if (!isAlreadyApplied) {
      setAppliedJobs((prev) => [...prev, {
        ...job,
        companyLogo: job.companyLogo || '',
      }]);
    }
  };

  return (
    <JobContext.Provider value={{ 
      jobs, 
      setJobs, 
      savedJobs, 
      setSavedJobs, 
      appliedJobs, 
      applyForJob, 
      saveJob, 
      removeJob 
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
