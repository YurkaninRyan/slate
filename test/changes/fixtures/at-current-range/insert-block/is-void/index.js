
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  const next = state
    .change()
    .select(range)
<<<<<<< HEAD:test/changes/fixtures/at-current-range/insert-block/is-void/index.js
    .insertBlock('image')
    .state
=======
    .insertBlock('video')
    .apply()
>>>>>>> master:test/transforms/fixtures/at-current-range/insert-block/is-void/index.js

  const updated = next.document.getTexts().first()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStartOf(updated).toJS()
  )

  return next
}
