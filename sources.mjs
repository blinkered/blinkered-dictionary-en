/**
 * The collections that attest English, and where each comes from.
 *
 * The only language-specific file in this repository. How to read a collection lives in
 * `@blinkered/attestation`; what lives here is which collections, and why those.
 *
 * Chosen for **family** as much as for volume. Three collections gathered by one organization
 * are one opinion, so what matters is how many genuinely separate gatherers a word can be found
 * by: a wiki, a newspaper crawler, a shelf of books, a sentence bank, a translation, the crawled
 * web, and any site we fetch ourselves.
 */

import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  fineweb2Documents,
  gutenbergBody,
  harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  verseDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'en'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

/** A directory of Gutenberg texts, each named by its permanent ebook number. */
function gutenberg(dir) {
  const at = `${CACHE}${dir}`
  const books = readdirSync(at)
    .filter((file) => file.endsWith('.txt'))
    .map((file) => ({ locator: file.replace('.txt', ''), path: `${at}/${file}` }))
  return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
}

export const SOURCES = [
  {
    id: 'wiki:en',
    what: 'English Wikipedia — modern encyclopedic prose',
    needs: `${CACHE}enwiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}enwiki.xml.bz2`),
  },
  {
    id: 'wikisource:en',
    what: 'Wikisource — same Wikimedia family, so it corroborates rather than counts',
    needs: `${CACHE}enwikisource.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}enwikisource.xml.bz2`),
  },
  {
    id: 'lz:eng_news_2024_1M',
    what: 'Leipzig eng_news_2024_1M — modern news, cited by the page each sentence came from',
    needs: `${CACHE}eng_news_2024_1M`,
    documents: () => leipzig('eng_news_2024_1M'),
  },
  {
    id: 'lz:eng_news_2023_1M',
    what: 'Leipzig eng_news_2023_1M — modern news, cited by the page each sentence came from',
    needs: `${CACHE}eng_news_2023_1M`,
    documents: () => leipzig('eng_news_2023_1M'),
  },
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2',
    what: 'Tatoeba — contemporary, conversational',
    needs: `${CACHE}eng_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}eng_sentences.tsv`),
  },
  {
    id: 'gut',
    from: 'https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv',
    what: 'Project Gutenberg — published books, a register nothing else here reaches',
    needs: `${CACHE}gutenberg-en`,
    documents: () => gutenberg('gutenberg-en'),
  },
  {
    id: 'ebible:engwebp',
    from: 'https://ebible.org/Scriptures/engwebp_vpl.zip',
    what: 'A translation — a family nothing else here belongs to',
    needs: `${CACHE}ebible-engwebp/engwebp_vpl.txt`,
    documents: () => verseDocuments(`${CACHE}ebible-engwebp/engwebp_vpl.txt`),
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst of these scored 1%, an English
    // book read as Cyrillic. Below this floor a book is not legible enough to attest anything.
    legible: 0.35,
    what: 'Internet Archive english books — literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-en`,
    from: 'https://archive.org/details/booksbylanguage_english',
    documents: () => {
      const dir = `${CACHE}archive-en`
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => ({ locator: file.replace('.txt', ''), path: `${dir}/${file}` }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
].filter((source) => {
  // A collection that has not been downloaded is skipped with a warning rather than crashing
  // the build, and which collections a language actually has is a fact worth seeing in the log.
  // Checked by path rather than by calling `documents()`: these are lazy generators, so calling
  // one proves nothing and calling it twice would open the file twice.
  if (existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * English publishers, each its own family.
 *
 * **Chosen for spread rather than size.** English is written by more people in more places than
 * any other language here, and a list built from twenty American news sites would be a list of
 * American news English. So: the British, Irish, Canadian, Australian, Indian, Hong Kong,
 * Singaporean, Nigerian and South African press alongside the American; long-form magazines and
 * a science publisher for the words journalism does not use; and three governments, which write
 * a register of their own and are reliably crawlable.
 *
 * English starts with more ready-made collections than any other language — nine thousand
 * Gutenberg books alone — so these are here to reach the parts of a 174,000-word candidate list
 * that books, encyclopedias and newswire do not.
 */
export const DOMAINS = [
  // Books and scholarship, a register the news domains above never reach
  'bartleby.com', 'poetryfoundation.org', 'poets.org', 'lrb.co.uk',
  'nybooks.com', 'publicdomainreview.org', 'standardebooks.org',
  // The press, deliberately spread across the varieties of English
  'theguardian.com', 'bbc.co.uk', 'irishtimes.com', 'independent.ie',
  'npr.org', 'apnews.com', 'pbs.org',
  'cbc.ca', 'theglobeandmail.com',
  'abc.net.au', 'smh.com.au',
  'thehindu.com', 'indianexpress.com',
  'scmp.com', 'straitstimes.com',
  'punchng.com', 'news24.com', 'nation.africa',
  // Long-form and specialist, for the vocabulary a news cycle never needs
  'theatlantic.com', 'aeon.co', 'nature.com', 'sciencedaily.com', 'arstechnica.com',
  // Government, a register of its own and reliably crawlable
  'gov.uk', 'canada.ca', 'govinfo.gov',
]

/**
 * Pages fetched by searching for words the collections missed, one family per domain.
 *
 * Absent until a harvest has been run; see the repository README.
 */
export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 16575
