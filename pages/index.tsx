import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import fetch from 'node-fetch'
import { apiBaseUrl } from '../constants'
import Link from 'next/link'

type StaticProps = {
  breeds: string[]
}

type BreedsList = {
  message: {
    [breed: string]: string[]
  }
  status: string
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const response = await fetch(`${apiBaseUrl}/breeds/list/all`)
  const listOfBreeds = (await response.json()) as BreedsList

  return {
    props: {
      breeds: Object.keys(listOfBreeds.message),
    },
    revalidate: 36000,
  }
}

export const config = {
  unstable_runtimeJS: false,
}

const Home: NextPage<StaticProps> = ({ breeds }) => {
  return (
    <>
      <Head>
        <title>Doglia</title>
      </Head>
      <main className="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {breeds.map((breed) => (
          <article key={breed} className="text-center shadow-md">
            <h2>
              <Link href={`/breeds/${breed}`}>
                <a className="block h-full w-full cursor-pointer p-4">
                  {breed}
                </a>
              </Link>
            </h2>
          </article>
        ))}
      </main>
    </>
  )
}

export default Home
