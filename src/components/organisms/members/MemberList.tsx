import React, { type ComponentType } from 'react'

import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import MemberListShell from './MemberListShell'

type SortValue = 'member-asc' | 'name-asc' | 'name-desc' | 'nrp-asc' | 'nrp-desc'

type MemberFilters = {
  search?: string | string[]
  region?: string | string[]
  sort?: string | string[]
}

type MemberCard = {
  CardMember: ComponentType
  id: string
  name: string
  nrp: string
  region: string
}

const membersDirectory = path.join(process.cwd(), 'src/components/molecules/members')

const getSingleValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

const normalize = (value: string) => value.trim().toLowerCase()

const compareMemberDirectoryNames = (first: string, second: string) => {
  const firstNumber = Number(first)
  const secondNumber = Number(second)
  const firstIsNumber = Number.isFinite(firstNumber)
  const secondIsNumber = Number.isFinite(secondNumber)

  if (firstIsNumber && secondIsNumber) {
    return firstNumber - secondNumber
  }

  if (firstIsNumber) {
    return -1
  }

  if (secondIsNumber) {
    return 1
  }

  return first.localeCompare(second)
}

const compareMemberCardIds = (first: MemberCard, second: MemberCard) => compareMemberDirectoryNames(first.id, second.id)

const getMemberText = async (directory: string) => {
  const cardPath = path.join(membersDirectory, directory, 'CardMember.tsx')
  const cardSource = await readFile(cardPath, 'utf8')
  const paragraphs = Array.from(cardSource.matchAll(/<p>([\s\S]*?)<\/p>/g), (match) =>
    match[1].replace(/<[^>]*>/g, '').trim()
  )

  return {
    name: paragraphs[0] ?? '',
    nrp: paragraphs[1] ?? directory,
    region: paragraphs[2] ?? ''
  }
}

const filterMemberCards = (memberCards: MemberCard[], filters: MemberFilters) => {
  const search = normalize(getSingleValue(filters.search))
  const region = normalize(getSingleValue(filters.region))
  const sort = getSingleValue(filters.sort) as SortValue

  return memberCards
    .filter((memberCard) => {
      const matchesSearch =
        !search || normalize(memberCard.name).includes(search) || normalize(memberCard.nrp).includes(search)
      const matchesRegion = !region || normalize(memberCard.region).includes(region)

      return matchesSearch && matchesRegion
    })
    .sort((first, second) => {
      switch (sort) {
        case 'name-desc':
          return second.name.localeCompare(first.name) || compareMemberCardIds(first, second)
        case 'nrp-asc':
          return Number(first.nrp) - Number(second.nrp) || compareMemberCardIds(first, second)
        case 'nrp-desc':
          return Number(second.nrp) - Number(first.nrp) || compareMemberCardIds(first, second)
        case 'name-asc':
          return first.name.localeCompare(second.name) || compareMemberCardIds(first, second)
        case 'member-asc':
        default:
          return compareMemberCardIds(first, second)
      }
    })
}

const getMemberCards = async () => {
  const entries = await readdir(membersDirectory, { withFileTypes: true })
  const memberDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareMemberDirectoryNames)

  return Promise.all(
    memberDirectories.map(async (directory) => {
      const memberText = await getMemberText(directory)
      const memberModule = (await import(`@/components/molecules/members/${directory}/CardMember`)) as {
        default: ComponentType
      }

      return {
        CardMember: memberModule.default,
        id: directory,
        ...memberText
      }
    })
  )
}

type MemberListProps = {
  filters: MemberFilters
}

const MemberList = async ({ filters }: MemberListProps) => {
  const memberCards = await getMemberCards()
  const filteredMemberCards = filterMemberCards(memberCards, filters)

  return (
    <MemberListShell>
      {filteredMemberCards.map(({ CardMember, id }) => (
        <CardMember key={id} />
      ))}
      {filteredMemberCards.length === 0 ? (
        <p className="col-span-full py-24 text-center text-xl font-semibold text-white">No members found.</p>
      ) : null}
    </MemberListShell>
  )
}

export default MemberList
