<template>
  <div class="directory-shell">
    <div class="directory-toolbar">
      <label class="directory-search">
        <span>Search locales</span>
        <input v-model="query" type="search" placeholder="Try Hindi, ar-SA, Euro, Indian, feminine…" />
      </label>

      <div class="directory-stats">
        <span>{{ filteredRows.length }} locales</span>
        <span>{{ documentedRows }} with dedicated landing pages</span>
      </div>
    </div>

    <div class="directory-table-wrap">
      <table class="directory-table">
        <thead>
          <tr>
            <th>Locale</th>
            <th>Language</th>
            <th>Currency</th>
            <th>Scale</th>
            <th>Ordinal</th>
            <th>Gender</th>
            <th>Fraction</th>
            <th>Formal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredRows" :id="`locale-${row.code.toLowerCase()}`" :key="row.code">
            <td>
              <div class="locale-cell">
                <span class="flag">{{ row.flag }}</span>
                <code>{{ row.code }}</code>
              </div>
            </td>
            <td>
              <a v-if="row.page" :href="withBase(row.page)">{{ row.language }}</a>
              <span v-else>{{ row.language }}</span>
              <div class="country">{{ row.country }}</div>
            </td>
            <td>{{ row.currency }}</td>
            <td>{{ row.scale }}</td>
            <td>{{ row.ordinal ? 'Yes' : 'No' }}</td>
            <td>{{ row.gender ? 'Yes' : 'No' }}</td>
            <td>{{ row.fractionStyle ? 'Yes' : 'No' }}</td>
            <td>{{ row.formal ? 'Yes' : 'No' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { localeDirectoryRows } from '../data/localeDirectory';

const query = ref('');

const filteredRows = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  if (!normalizedQuery) {
    return localeDirectoryRows;
  }

  return localeDirectoryRows.filter((row) =>
    [
      row.code,
      row.language,
      row.country,
      row.currency,
      row.scale,
      row.page ? 'documented' : 'undocumented',
      row.gender ? 'feminine masculine gender' : '',
      row.fractionStyle ? 'fraction legal decimal' : '',
      row.formal ? 'formal financial' : '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
});

const documentedRows = localeDirectoryRows.filter((row) => Boolean(row.page)).length;
</script>

<style scoped>
.directory-shell {
  margin-top: 1.5rem;
}

.directory-toolbar {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.directory-search {
  display: grid;
  gap: 0.4rem;
  min-width: min(100%, 28rem);
}

.directory-search span {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.directory-search input {
  width: 100%;
  padding: 0.8rem 0.95rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.directory-stats {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.directory-stats span {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  font-size: 0.85rem;
}

.directory-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.directory-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.93rem;
}

.directory-table th,
.directory-table td {
  padding: 0.8rem 0.9rem;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
}

.directory-table th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.locale-cell {
  display: flex;
  gap: 0.55rem;
  align-items: center;
}

.flag {
  font-size: 1.05rem;
}

.country {
  margin-top: 0.2rem;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

@media (max-width: 768px) {
  .directory-table {
    font-size: 0.88rem;
  }

  .directory-table th,
  .directory-table td {
    padding: 0.7rem 0.75rem;
  }
}
</style>
