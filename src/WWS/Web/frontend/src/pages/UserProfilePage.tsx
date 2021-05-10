import React from "react";
import {useQuery} from "react-query";
import AuthenticatedLayout from "../layout/AuthenticatedLayout";


export interface Git {
  name: string;
  description: string;
  subscribers_count: number;
  stargazers_count: number;
  forks_count: number;
}

export async function fetchGit(): Promise<Git> {
  const response = await fetch('https://api.github.com/repos/tannerlinsley/react-query');
  if (!response.ok) {
    throw new Error("baj van...")
  }
  return await response.json() as Git;
}

const UserProfilePage = () => {
  const { isLoading, error, data } = useQuery<Git, Error>('git',fetchGit);

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  if (data === undefined) return <div />;

  return (
    <AuthenticatedLayout>
      <div>
        <h1>{data.name}</h1>
        <p>{data.description}</p>
        <strong>👀 {data.subscribers_count}</strong>{' '}
        <strong>✨ {data.stargazers_count}</strong>{' '}
        <strong>🍴 {data.forks_count}</strong>
      </div>
    </AuthenticatedLayout>
  )
}

export default UserProfilePage;
