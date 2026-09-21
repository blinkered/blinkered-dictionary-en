# Blinkered dictionary: English

The English word list, and the evidence for every word in it. A word is here because
**three independent collections of English text were found to contain it** — not because a
dictionary listed it. `ATTESTATIONS` records which collections, and where in them, so any
claim in `words.txt` can be checked by fetching the document it cites.

107,670 of 174,456 candidates proved (61.7%), across 15
independent families, 14 of them checkable by a stranger. `status.json` carries
the current numbers and whether this language is blessed to ship.

The method, the rule, and the tooling live in
[blinkered-attestation](https://github.com/blinkered/blinkered-attestation).

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the
project: a licence that claimed more than we can support would undo the argument the
evidence is here to make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, `attestations/*.tsv`, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `MIT` | `dropped.tsv` — **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were
found to contain it. The record of which collections, and where in them, is a statement
of fact about those texts rather than a copy of them, and nothing a licence governs was
taken from the dictionary that proposed the candidates. To the extent any right subsists
in the compilation, it is waived.

**Why `dropped.tsv` is not.** Every other file here rests on evidence we gathered. That
one does not: it is the candidates that failed, and a candidate that failed is a word we
have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms — here
`MIT`. See
[`blinkered-attestation/candidates/en/LICENSE`](https://github.com/blinkered/blinkered-attestation/blob/main/candidates/en/LICENSE).
