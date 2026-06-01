import Hero from '@/components/organisms/fun-corners/Hero'
import Menfess from '@/components/organisms/fun-corners/Menfess'

type FunCornerProps = {
    searchParams: Promise<{
        page?: string | string[]
    }>
}

const getInitialPage = (page?: string | string[]) => {
    const pageValue = Array.isArray(page) ? page[0] : page
    const parsedPage = Number.parseInt(pageValue ?? '', 10)

    if (!Number.isFinite(parsedPage)) {
        return 1
    }

    return Math.max(1, Math.floor(parsedPage))
}

export default async function FunCorner({ searchParams }: FunCornerProps) {
    const initialPage = getInitialPage((await searchParams).page)

    return (
        <>
            <Hero />
            <Menfess initialPage={initialPage} />
        </>
    )
}
