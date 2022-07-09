import React from 'react'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import fetch from 'node-fetch'
import { apiBaseUrl } from '../../constants'

type StaticProps = {
  breedImages: string[]
  breedName: string
}

type BreedsList = {
  message: {
    [breed: string]: string[]
  }
  status: string
}

type BreedsImageList = {
  message: string[]
  status: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${apiBaseUrl}/breeds/list/all`)
  const listOfBreeds = (await response.json()) as BreedsList
  const paths = Object.keys(listOfBreeds.message).map((breedName) => ({
    params: {
      breedName,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  StaticProps,
  { breedName: string }
> = async (context) => {
  const breedName = context.params?.breedName

  if (!breedName) {
    return {
      notFound: true,
    }
  }

  const response = await fetch(
    `${apiBaseUrl}/breed/${breedName}/images/random/20`
  )
  const listOfBreedImages = (await response.json()) as BreedsImageList

  return {
    props: {
      breedImages: listOfBreedImages.message,
      breedName,
    },
    revalidate: 36000,
  }
}

export const config = {
  unstable_runtimeJS: false,
}

const Home: NextPage<StaticProps> = ({ breedImages, breedName }) => {
  return (
    <>
      <Head>
        <title>Doglia</title>
      </Head>
      <h1 className="mb-8 text-center text-2xl font-bold">
        Doglia: {breedName}
      </h1>
      <main className="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {breedImages.map((breedImage) => (
          <img
            key={breedImage}
            className="w-full shadow-md"
            src={breedImage}
            alt=""
          />
        ))}
      </main>
    </>
  )
}

export default Home
