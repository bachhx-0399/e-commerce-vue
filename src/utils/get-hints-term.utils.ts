import { type CardProps } from '@/types/card.type'

const getHintsTerm = (searchTerm: string, productItems: CardProps[]) => {
    const maxHintTerm = 5

    // Normalize search term (convert to lowercase to make search case-insensitive)
    const normalizedSearchTerm = searchTerm.toLowerCase().trim()

    // Set to store unique hints
    const hintSet = new Set<string>()

    // Create regex to split the product name based on the search term
    const regex = new RegExp(`(${normalizedSearchTerm})`, 'gi')

    productItems.forEach((item) => {
        // Split the name, including the search term
        const parts = [...item.name.split(regex), ...item.description.split(regex)]

        parts.forEach((part, index) => {
            if (part.toLocaleLowerCase() === normalizedSearchTerm) {
                const nextPart = parts[index + 1]
                const perviousPart = parts[index - 1]
                const nextParts = nextPart?.trim().split(' ')
                const perviousParts = perviousPart?.trim().split(' ')
                const nextWord = nextParts?.[0]
                const perviousWord = perviousParts?.[perviousParts.length - 1]
                if (nextPart && !perviousPart) {
                    if (nextPart[0] === ' ') {
                        // Add hint to set                        
                        hintSet.add((normalizedSearchTerm + ' ' + nextWord).trim()) // Add the next word (after the search part.)
                        return
                    } else {
                        // Add hint to set
                        hintSet.add((normalizedSearchTerm + nextWord).trim()) // Add the next word (after the search part.)
                    }
                }

                if (!nextPart && perviousPart) {
                    if (perviousPart[perviousPart.length - 1] === ' ') {
                        // Add hint to set
                        hintSet.add((perviousWord + ' ' + normalizedSearchTerm).trim()) // Add the previous word (before the search part.)
                    } else {
                        // Add hint to set
                        hintSet.add((perviousWord + normalizedSearchTerm).trim()) // Add the previous word (before the search part.)
                        return
                    }
                }

                if (nextPart && perviousPart) {
                    if (perviousPart[perviousPart.length - 1] === ' ' && nextPart[0] === ' ') {                        
                        // Add hint to set
                        hintSet.add(
                            perviousWord + ' ' + normalizedSearchTerm + ' ' + nextWord
                        ) // Add the previous word (before the search part.) and the next word (after the search part.)
                        return
                    } else if (perviousPart[perviousPart.length - 1] === ' ' && nextPart[0] !== ' ') {
                        // Add hint to set
                        hintSet.add((normalizedSearchTerm + nextWord).trim()) // Add the previous word (before the search part.) and the next word (after the search part.)
                        return
                    } else if (perviousPart[perviousPart.length - 1] !== ' ' && nextPart[0] === ' ') {
                        // Add hint to set
                        hintSet.add(perviousWord + normalizedSearchTerm + ' ' + nextWord) // Add the previous word (before the search part.) and the next word (after the search part.)
                        return
                    } else {
                        // Add hint to set
                        hintSet.add(perviousWord + normalizedSearchTerm + nextWord) // Add the previous word (before the search part.) and the next word (after the search part.)
                        return
                    }
                }
            }
        })
    })

    // Convert set to array and limit to maxHintTerm results
    const hints = Array.from(hintSet)

    const trimHints = new Set<string>()

    hints.forEach((hint) => {
        trimHints.add(hint.trim())
    })

    return Array.from(trimHints).slice(0, maxHintTerm)
}

export default getHintsTerm
