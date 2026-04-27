# CDS v8→v9 Migration Priority Report

Repos consuming `@coinbase/cds-{web,mobile,common,illustrations,*-visualization}` (or `@cbhq/...` mirror), ranked for migration prioritization. Filtered to repos with at least one human commit on the default branch in the last 6 months. Team handles validated against `coinbase.ghe.com` (source of truth during cbhq.net → GHE transition).

## Executive summary

- **231 active consumer repos** (filtered from 238 total — 7 stale repos dropped).
- **2 monolithic monorepos drive the bulk of CDS usage:** `frontend/coinbase-www` (1,814+ files importing CDS, ~32 owner teams) and `consumer/react-native` (1,633+ files, ~28 owner teams). Sourcegraph scans were capped at 5,000 hits each — these are *floor* numbers.
- **Tier 2 (top 15 single-purpose repos):** see ranked table at the bottom; sized by # `package.json` declarations of CDS deps.
- **40 CODEOWNERS team handles are stale** (no longer exist on GHE) — flagged inline.

### Recommended migration order

1. **`coinbase-www`** & **`consumer/react-native`** in parallel, broken down per package/lib/app (sections below). Cover the largest sub-areas first.
2. **Single-purpose Tier-2 repos** (3+ CDS package.json deps): the `Tier-2 single-purpose repos` table below.
3. **Tier-3 small repos** (1-2 package.json deps): bulk-migrate via codemod once Tier-1/2 patterns are established.

---

# Tier 1A: `frontend/coinbase-www` (cbhq.net)

Monolith hosting Coinbase consumer web app, marketing site, and shared components.

- **CDS-importing files:** ≥1,814 (Sourcegraph cap hit)
- **Distinct logical sub-areas with CDS imports:** 117 (CODEOWNERS-bucketed)
- **Repo `pushed_at`:** active
- **Top repo-wide contributors:** `saivann-carignan`(1815), `dancoffman`(1765), `jorilallo`(1551)

## Sub-areas ranked by CDS file count

Each row = a logical sub-app/lib/view bucket grouped by CODEOWNERS scope. "Top contributors (last 6mo)" comes from `GET /repos/.../commits?path=<bucket>&since=2025-10-27`, deduped & bot-filtered.

| # | Sub-area | CDS files | Owner team(s) → first members | Top contributors (last 6mo) | Recent commits |
|--:|---|---:|---|---|---:|
| 1 | `marketing/src/` | 74 | @frontend/galop _(team not on GHE)_<br>@frontend/growth-discovery-and-conversion-frontend → `angela-top`, `james-long` | `saivann-carignan`(93), `angela-top`(58), `tathya-joshi`(31) | 517 |
| 2 | `app/src/views/Lend/` | 56 | @frontend/defi-lend-frontend _(stale; rename?: `retail-spend-frontend`)_ | `dennis-markovchin-1`(48), `alexander-jakel`(12), `tao-yang`(10) | 100 |
| 3 | `libs/onboarding/` | 53 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh`<br>@frontend/advanced-trading-derivatives-web → `jona-frank`, `naeim-semsarilar` | `matas-masys`(21), `tathya-joshi`(7), `david-quintero`(7) | 120 |
| 4 | `app/src/product/cb1/` | 43 | @frontend/cb1-frontend → `erich-kuerschner`, `rahul-agarwal`<br>@frontend/hnwi-frontend → `rahul-agarwal`, `travis-bloom` | `brian-kasper`(22), `zhongchi-li`(21), `alessio-symons`(14) | 171 |
| 5 | `packages/cdx-ui/` | 40 | @frontend/galop _(team not on GHE)_ | `michell-ocanadoespiritosanto`(30), `daniel-aguileraterrazas`(21), `saivann-carignan`(18) | 100 |
| 6 | `applications/cdx-docs/` | 37 | @frontend/galop _(team not on GHE)_ | `michell-ocanadoespiritosanto`(28), `daniel-aguileraterrazas`(21), `saivann-carignan`(21) | 100 |
| 7 | `app/src/views/AssetPage/` | 34 | @frontend/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `ilia-shilov`(21), `duggan-burke`(14), `serra-park`(8) | 100 |
| 8 | `app/src/product/aib/` | 29 | @frontend/incentives-aib _(stale; rename?: `growth-incentives-leads`)_ | `taranjitsingh-khokhar`(24), `matas-masys`(15), `henrique-ramos`(11) | 89 |
| 9 | `app/src/views/AdvancedOrders/` | 29 | @frontend/advanced-trading-web → `jona-frank`, `diego-torres` | `nhan-bui`(11), `matas-masys`(10), `johnjacob-go`(8) | 100 |
| 10 | `app/src/components/StakingV2/` | 27 | @frontend/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `leon-haggarty`(27), `jay-ho`(12), `matas-masys`(8) | 100 |
| 11 | `app/src/views/Derivatives/` | 27 | @frontend/advanced-trading-derivatives-web → `jona-frank`, `naeim-semsarilar` | `saif-alesawy`(17), `tim-vanlerberg`(15), `mehmetberke-karadayi`(11) | 100 |
| 12 | `app/src/views/YieldCenter/` | 27 | @frontend/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `leon-haggarty`(13), `tanchi-le`(12), `jay-ho`(9) | 100 |
| 13 | `app/src/views/Advanced/` | 27 | @frontend/advanced-trading-spot-web → `jona-frank`, `siyuan-bian`<br>@frontend/advanced-trading-web → `jona-frank`, `diego-torres` | `nhan-bui`(74), `lachlan-tweedie`(27), `gourav-charaya`(21) | 355 |
| 14 | `app/src/components/Layout/` | 27 | @frontend/home-and-app-arch-frontend → `nichil-stewart`, `parag-datar`<br>@frontend/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `matas-masys`(45), `saivann-carignan`(19), `weslie-zhang`(15) | 448 |
| 15 | `app/src/components/Risk/` | 26 | @frontend/risk-platform-eng → `mingshuo-zhang`, `weiting-hsu` | `drew-paterno`(45), `matas-masys`(14), `saivann-carignan`(11) | 100 |
| 16 | `app/src/components/Stablecoin/` | 26 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `matas-masys`(14), `tanyu-li`(14), `saivann-carignan`(9) | 100 |
| 17 | `app/src/views/CoinbaseCard/` | 25 | @frontend/creditcard-fe-eng _(team not on GHE)_ | `matas-masys`(19), `tao-alexis`(15), `saivann-carignan`(15) | 100 |
| 18 | `app/src/views/AdvancedFees/` | 24 | @frontend/advanced-trading-web → `jona-frank`, `diego-torres` | `matas-masys`(19), `nhan-bui`(14), `saivann-carignan`(11) | 88 |
| 19 | `app/src/views/AdvancedTrade/` | 22 | @frontend/advanced-trading-web → `jona-frank`, `diego-torres` | `keith-mccall`(21), `johnjacob-go`(20), `nhan-bui`(19) | 100 |
| 20 | `app/src/components/Notifications/` | 19 | @frontend/notifications-frontend → `elijah-quartey`, `yash-desai` | `greg-alway`(5), `matas-masys`(5), `saivann-carignan`(5) | 38 |
| 21 | `app/src/views/Transact/` | 19 | @frontend/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `sayali-ashoklagad`(8), `giuseppe-barillari`(7), `tathya-joshi`(5) | 100 |
| 22 | `packages/cdx-components/` | 19 | @frontend/galop _(team not on GHE)_ | `saivann-carignan`(16), `matas-masys`(13), `tathya-joshi`(6) | 56 |
| 23 | `app/src/views/Home/` | 18 | @frontend/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `tae-yoon`(8), `tim-vanlerberg`(6), `zhongchi-li`(5) | 100 |
| 24 | `app/src/views/RewardsHub/` | 18 | @frontend/growth-incentives-frontend → `james-long`, `chao-chen` | `matas-masys`(15), `saivann-carignan`(10), `kyla-yuswanson`(8) | 70 |
| 25 | `app/src/components/SimpleTrade/` | 17 | @frontend/simple-trade-frontend → `naeim-semsarilar`, `michael-chan` | `sayali-ashoklagad`(31), `matas-masys`(6), `brendan-lynch`(6) | 100 |
| 26 | `app/src/components/BuySellComponents/` | 17 | @frontend/simple-trade-frontend → `naeim-semsarilar`, `michael-chan`<br>@frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `matas-masys`(21), `saivann-carignan`(16), `ruikun-hao`(9) | 81 |
| 27 | `app/src/components/Staking/` | 16 | @frontend/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `eric-copeland`(22), `tathya-joshi`(3), `ruikun-hao`(1) | 29 |
| 28 | `app/src/views/InviteFriends/` | 16 | @frontend/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `matas-masys`(10), `saivann-carignan`(8), `ruikun-hao`(6) | 53 |
| 29 | `app/src/views/Gamification/` | 15 | @frontend/growth-incentives-frontend → `james-long`, `chao-chen` | `kiwook-kwon`(8), `daniel-aguileraterrazas`(8), `matas-masys`(7) | 57 |
| 30 | `app/src/components/Trade/` | 15 | @frontend/simple-trade-frontend → `naeim-semsarilar`, `michael-chan`<br>@frontend/retail-equities-frontend → `naeim-semsarilar`, `michael-chan` | `james-zhang`(27), `jiayuan-chee`(23), `michael-chan`(9) | 200 |
| 31 | `app/src/views/CoinbizPayments/` | 14 | @frontend/coinbiz → `umar-bolatov`, `larry-zhao` | `vivian-hoang`(20), `zhonghao-ji`(10), `ruikun-hao`(9) | 100 |
| 32 | `app/src/components/SendReceive/` | 12 | @frontend/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `justin-taylor-1`(13), `sam-morton`(10), `joaopedro-pianta`(9) | 100 |
| 33 | `packages/user-guidance/` | 12 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `matas-masys`(13), `saivann-carignan`(11), `tathya-joshi`(5) | 62 |
| 34 | `app/src/components/AppropriatenessTest/` | 11 | @frontend/intl-web → `krishnasaijaswanth-rongali`, `jona-frank` | `matas-masys`(12), `nhan-bui`(3), `saivann-carignan`(3) | 27 |
| 35 | `app/src/components/OpenBanking/` | 11 | @frontend/intl-web → `krishnasaijaswanth-rongali`, `jona-frank` | `matas-masys`(13), `saivann-carignan`(9), `yongkang-qiu`(5) | 44 |
| 36 | `app/src/views/Settings/` | 11 | @frontend/home-and-app-arch-frontend → `nichil-stewart`, `parag-datar`<br>@frontend/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `sam-morton`(49), `matas-masys`(34), `justin-taylor-1`(16) | 159 |
| 37 | `app/src/views/AssetRewardCenter/` | 9 | @frontend/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `tanchi-le`(33), `leon-haggarty`(19), `tathya-joshi`(5) | 100 |
| 38 | `app/src/views/Equities/` | 9 | @frontend/retail-equities-frontend → `naeim-semsarilar`, `michael-chan` | `colin-johnson`(21), `michael-chan`(20), `samuel-han`(11) | 100 |
| 39 | `app/src/views/Subscription/` | 9 | @frontend/cb1-frontend → `erich-kuerschner`, `rahul-agarwal` | `caitlin-coyiuto`(22), `saivann-carignan`(12), `ruikun-hao`(9) | 100 |
| 40 | `app/src/components/Interac/` | 8 | @frontend/intl-web → `krishnasaijaswanth-rongali`, `jona-frank` | `matas-masys`(8), `haseeb-ahmed`(8), `saivann-carignan`(6) | 51 |
| 41 | `app/src/views/Briefing/` | 8 | @frontend/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `matas-masys`(11), `saivann-carignan`(5), `david-mkrtchyan`(4) | 36 |
| 42 | `app/src/views/DefiBorrow/` | 8 | @frontend/retail-defi-borrow → `siva-vasanth`, `joseph-moyalan` | `steven-psomas`(40), `matas-masys`(11), `ruikun-hao`(6) | 90 |
| 43 | `applications/card-form-app/` | 8 | @frontend/payments-frontend → `seimon-grando`, `priyansh-gupta` | `saivann-carignan`(25), `matas-masys`(13), `tathya-joshi`(7) | 77 |
| 44 | `app/src/components/PayPal/` | 7 | @frontend/intl-web → `krishnasaijaswanth-rongali`, `jona-frank` | `matas-masys`(7), `saivann-carignan`(5), `ruikun-hao`(2) | 27 |
| 45 | `app/src/views/AssetPagePortfolio/` | 7 | @frontend/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `matas-masys`(13), `serra-park`(8), `saivann-carignan`(6) | 70 |
| 46 | `app/src/views/ChangeCountry/` | 7 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `matas-masys`(10), `tathya-joshi`(5), `saivann-carignan`(5) | 46 |
| 47 | `app/src/components/AccountChecklist/` | 6 | @frontend/growth-activation _(stale; rename?: `growth-notifications`)_ | `matas-masys`(9), `saivann-carignan`(8), `vitor-dino`(7) | 67 |
| 48 | `app/src/views/AdvancedPortfolio/` | 6 | @frontend/advanced-trading-web → `jona-frank`, `diego-torres` | `matas-masys`(7), `tathya-joshi`(7), `nhan-bui`(6) | 100 |
| 49 | `app/src/views/Notifications/` | 6 | @frontend/notifications-frontend → `elijah-quartey`, `yash-desai` | `matas-masys`(8), `tathya-joshi`(4), `elijah-quartey`(4) | 34 |
| 50 | `app/src/views/Trade/` | 6 | @frontend/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `jaime-biernaski`(11), `david-quintero`(8), `weslie-zhang`(7) | 76 |
| 51 | `app/src/` | 6 | @frontend/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `gourav-charaya`(11), `lachlan-tweedie`(10), `nhan-bui`(10) | 105 |
| 52 | `app/src/views/AdvancedReferral/` | 5 | @frontend/advanced-trading-spot-web → `jona-frank`, `siyuan-bian` | `matas-masys`(14), `nhan-bui`(7), `keith-low`(5) | 45 |
| 53 | `libs/advanced-trade-web/` | 5 | @frontend/advanced-trading-spot-web → `jona-frank`, `siyuan-bian` | `nhan-bui`(17), `crystal-wang-1`(14), `gourav-charaya`(12) | 100 |
| 54 | `libs/shared/` | 5 | @frontend/home-and-app-arch-frontend → `nichil-stewart`, `parag-datar`<br>@frontend/growth-discovery-and-conversion-frontend → `angela-top`, `james-long` | `matas-masys`(11), `saivann-carignan`(8), `ruikun-hao`(5) | 48 |
| 55 | `app/src/components/AddBankAccount/` | 4 | @frontend/payments-frontend → `seimon-grando`, `priyansh-gupta` | `krishnasaijaswanth-rongali`(11), `matas-masys`(4), `yashraj-sinha`(4) | 31 |
| 56 | `app/src/components/BalanceSummaryModal/` | 4 | @frontend/assets-and-balances-frontend → `joanna-lee`, `kyle-baker` | `serra-park`(26), `ruikun-hao`(10), `matas-masys`(10) | 100 |
| 57 | `app/src/components/SystemAlert/` | 4 | @frontend/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `matas-masys`(6), `nhan-bui`(3), `ruikun-hao`(2) | 20 |
| 58 | `app/src/components/UpsellFramework/` | 4 | @frontend/home-and-app-arch-frontend → `nichil-stewart`, `parag-datar` | `vrushabh-jambhulkar`(15), `matas-masys`(4), `nhan-bui`(4) | 34 |
| 59 | `app/src/components/WrappedAsset/` | 4 | @frontend/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `matas-masys`(13), `saivann-carignan`(6), `ruikun-hao`(5) | 47 |
| 60 | `app/src/product/hnwi/` | 4 | @frontend/hnwi-frontend → `rahul-agarwal`, `travis-bloom` | `brian-kasper`(40), `vrushabh-jambhulkar`(6), `tathya-joshi`(4) | 100 |
| 61 | `app/src/views/Activity/` | 4 | @frontend/coinbiz → `umar-bolatov`, `larry-zhao` | `zhonghao-ji`(24), `saivann-carignan`(4), `tathya-joshi`(3) | 48 |
| 62 | `app/src/views/Assets/` | 4 | @frontend/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `matas-masys`(12), `saivann-carignan`(11), `victor-gomes`(7) | 100 |
| 63 | `app/src/components/FiatInterest/` | 4 | @frontend/fiat-interest-fe _(team not on GHE)_ | `matas-masys`(18), `phakhee-man`(16), `saivann-carignan`(7) | 81 |
| 64 | `packages/advanced-components-web/` | 4 | @frontend/advanced-trading-web → `jona-frank`, `diego-torres` | `nhan-bui`(52), `saivann-carignan`(8), `matas-masys`(7) | 104 |
| 65 | `app/src/components/BlockingMessage/` | 3 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `matas-masys`(4), `sneh-shah`(4), `tathya-joshi`(3) | 25 |
| 66 | `app/src/components/LinkBancomat/` | 3 | @frontend/intl-web → `krishnasaijaswanth-rongali`, `jona-frank` | `matas-masys`(6), `chitesh-bansal`(4), `nhan-bui`(3) | 20 |
| 67 | `app/src/components/LinkFedWire/` | 3 | @frontend/payments-frontend → `seimon-grando`, `priyansh-gupta` | `matas-masys`(4), `saivann-carignan`(2), `reed-williams`(1) | 10 |
| 68 | `app/src/views/MarqetaIssuance/` | 3 | @frontend/creditcard-fe-eng _(team not on GHE)_ | `matas-masys`(4), `saivann-carignan`(4), `ruikun-hao`(1) | 11 |
| 69 | `app/src/views/Raise/` | 3 | @frontend/raise → `josh-jaques`, `nathaniel-mallet` | `houan-lin`(15), `edward-brodski`(14), `raj-jain-1`(14) | 100 |
| 70 | `app/src/views/VerifyMarqetaDocument/` | 3 | @frontend/creditcard-fe-eng _(team not on GHE)_ | `matas-masys`(7), `saivann-carignan`(7), `david-mkrtchyan`(2) | 18 |
| 71 | `packages/proof-of-any-web/` | 3 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `matas-masys`(10), `saivann-carignan`(7), `hemny-singh`(5) | 32 |
| 72 | `app/src/components/AdvocacySignUpModal/` | 2 | @frontend/growth-advocacy → `alvaro-raminelli`, `lucas-bernardi` | `matas-masys`(12), `tathya-joshi`(4), `nhan-bui`(2) | 24 |
| 73 | `app/src/components/DepositFedwireModal/` | 2 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `ruikun-hao`(2), `matas-masys`(2), `akash-gupta-1`(2) | 14 |
| 74 | `app/src/components/DesktopQuickActions/` | 2 | @frontend/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `weslie-zhang`(4), `matas-masys`(4), `griffin-sloves`(4) | 26 |
| 75 | `app/src/components/IdVerificationModal/` | 2 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `matas-masys`(6), `saivann-carignan`(6), `renan-inacio`(4) | 29 |
| 76 | `app/src/components/Incentives/` | 2 | @frontend/growth-incentives-frontend → `james-long`, `chao-chen` | `matas-masys`(3), `ruikun-hao`(2), `saivann-carignan`(2) | 12 |
| 77 | `app/src/components/LinkAchBankAccount/` | 2 | @frontend/payments-frontend → `seimon-grando`, `priyansh-gupta` | `sandro-motyl`(10), `sachin-raghuwanshi`(9), `matas-masys`(7) | 47 |
| 78 | `app/src/components/LinkPayPal/` | 2 | @frontend/intl-web → `krishnasaijaswanth-rongali`, `jona-frank` | `matas-masys`(4), `saivann-carignan`(4), `tathya-joshi`(3) | 19 |
| 79 | `app/src/components/PhoneNumberModal/` | 2 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `matas-masys`(5), `saivann-carignan`(2), `reed-williams`(1) | 9 |
| 80 | `app/src/components/UsdcBuySell/` | 2 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `matas-masys`(7), `sayali-ashoklagad`(5), `saivann-carignan`(5) | 29 |
| 81 | `app/src/views/Accounting/` | 2 | @frontend/coinbiz → `umar-bolatov`, `larry-zhao` | `matas-masys`(4), `saivann-carignan`(2), `reed-williams`(1) | 13 |
| 82 | `app/src/views/AdvancedFills/` | 2 | @frontend/advanced-trading-web → `jona-frank`, `diego-torres` | `saivann-carignan`(6), `lachlan-tweedie`(4), `nhan-bui`(3) | 30 |
| 83 | `app/src/views/BoostSeasonIncentive/` | 2 | @frontend/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `matas-masys`(10), `saivann-carignan`(5), `vrushabh-jambhulkar`(3) | 28 |
| 84 | `app/src/views/Setup/` | 2 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `ayesha-malik`(4), `saivann-carignan`(3), `matas-masys`(2) | 21 |
| 85 | `app/src/views/UnifiedReferrals/` | 2 | @frontend/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `matas-masys`(4), `shraddha-pathradkar`(3), `ruikun-hao`(2) | 13 |
| 86 | `app/src/views/VerifyDocument/` | 2 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `matas-masys`(7), `renan-inacio`(4), `umar-bolatov`(3) | 26 |
| 87 | `applications/cdx-storybook/` | 2 | @frontend/galop _(team not on GHE)_ | `saivann-carignan`(6), `michell-ocanadoespiritosanto`(2), `reed-williams`(1) | 13 |
| 88 | `app/src/hooks/api/` | 2 | @frontend/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `jaime-biernaski`(12), `reed-williams`(2), `matas-masys`(2) | 17 |
| 89 | `app/src/components/AddLinkedAccountPickerModal/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `matas-masys`(10), `saivann-carignan`(10), `ruikun-hao`(4) | 74 |
| 90 | `app/src/components/BalanceSummaryV2/` | 1 | @frontend/assets-and-balances-frontend → `joanna-lee`, `kyle-baker` | `serra-park`(20), `kyle-baker`(17), `matas-masys`(7) | 83 |
| 91 | `app/src/components/BuySellModal/` | 1 | @frontend/simple-trade-frontend → `naeim-semsarilar`, `michael-chan` | `lachlan-tweedie`(1), `serra-park`(1), `reed-williams`(1) | 8 |
| 92 | `app/src/components/DepositModal/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `saivann-carignan`(10), `joaopedro-pianta`(8), `matas-masys`(7) | 67 |
| 93 | `app/src/components/DepositWithdraw/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `kaerah-lopez`(9), `taylor-lindsey`(7), `anthony-tersaakov`(7) | 100 |
| 94 | `app/src/components/IdCapture/` | 1 | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `matas-masys`(2), `saivann-carignan`(2), `miles-johnson`(1) | 9 |
| 95 | `app/src/components/LinkApplePayModal/` | 1 | @frontend/payments-frontend → `seimon-grando`, `priyansh-gupta` | `matas-masys`(3), `saivann-carignan`(3), `nhan-bui`(2) | 9 |
| 96 | `app/src/components/LinkCardFormSandbox/` | 1 | @frontend/payments-frontend → `seimon-grando`, `priyansh-gupta` | `tathya-joshi`(3), `matas-masys`(2), `reed-williams`(1) | 6 |
| 97 | `app/src/components/LinkSic/` | 1 | @frontend/intl-web → `krishnasaijaswanth-rongali`, `jona-frank` | `gan-xin`(2), `reed-williams`(1), `matas-masys`(1) | 5 |
| 98 | `app/src/components/LinkSwiftBankAccount/` | 1 | @frontend/intl-web → `krishnasaijaswanth-rongali`, `jona-frank` | `matas-masys`(2), `reed-williams`(1), `renan-inacio`(1) | 5 |
| 99 | `app/src/components/PaymentError/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `matas-masys`(4), `reed-williams`(1), `yago-azevedo`(1) | 9 |
| 100 | `app/src/components/PaymentMethod/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `reed-williams`(1), `matas-masys`(1) | 2 |
| 101 | `app/src/components/PaymentMethodIcon/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `matas-masys`(3), `phakhee-man`(2), `weiheng-lee`(2) | 11 |
| 102 | `app/src/components/PlaidLink/` | 1 | @frontend/payments-frontend → `seimon-grando`, `priyansh-gupta` | `saivann-carignan`(7), `sachin-raghuwanshi`(5), `matas-masys`(4) | 22 |
| 103 | `app/src/components/Referrals/` | 1 | @frontend/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `matas-masys`(2), `saivann-carignan`(2), `reed-williams`(1) | 6 |
| 104 | `app/src/components/Transaction/` | 1 | @frontend/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `justin-taylor-1`(24), `clayton-shaver`(11), `mehmetberke-karadayi`(8) | 100 |
| 105 | `app/src/components/WithdrawModal/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `matas-masys`(8), `ruikun-hao`(3), `weslie-zhang`(2) | 19 |
| 106 | `app/src/components/WithdrawablePaymentSelector/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `saivann-carignan`(6), `matas-masys`(5), `ruikun-hao`(2) | 22 |
| 107 | `app/src/utils/tests.tsx/` | 1 | @frontend/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `lachlan-tweedie`(2), `johnjacob-go`(2), `saivann-carignan`(2) | 24 |
| 108 | `app/src/views/Automations/` | 1 | @frontend/coinbiz → `umar-bolatov`, `larry-zhao` | `vivian-hoang`(21), `ruikun-hao`(1), `anant-jain-1`(1) | 41 |
| 109 | `app/src/views/Cash/` | 1 | @frontend/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `steven-psomas`(4), `tae-yoon`(3), `claudia-ying`(3) | 28 |
| 110 | `app/src/views/DebugPredictionTradeShare.tsx/` | 1 | @frontend/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `keith-low`(2), `chao-chen`(2), `reed-williams`(1) | 5 |
| 111 | `app/src/views/Explore/` | 1 | @frontend/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `matas-masys`(14), `ruikun-hao`(5), `saivann-carignan`(5) | 47 |
| 112 | `app/src/views/FundPerpetualsTrading/` | 1 | @frontend/advanced-trading-intx-web → `jona-frank`, `naeim-semsarilar` | `tathya-joshi`(3), `reed-williams`(1), `matas-masys`(1) | 6 |
| 113 | `app/src/views/Pay/` | 1 | @frontend/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `reed-williams`(1), `matas-masys`(1) | 2 |
| 114 | `app/src/views/PredictionMarkets/` | 1 | @frontend/retail-prediction-markets-frontend _(stale; rename?: `retail-equities-frontend`)_ | `eduardo-picolo`(31), `jay-sullivan`(21), `griffin-sloves`(9) | 100 |
| 115 | `packages/cms/` | 1 | @frontend/galop _(team not on GHE)_ | `saivann-carignan`(10), `daniel-aguileraterrazas`(2), `tathya-joshi`(1) | 21 |
| 116 | `packages/components/` | 1 | @frontend/galop _(team not on GHE)_ | `michell-ocanadoespiritosanto`(6), `matas-masys`(5), `saivann-carignan`(5) | 53 |
| 117 | `packages/web3-message-sign-modal/` | 1 | @frontend/travel-rule-eng → `gabriel-oliveirademarco`, `yongkang-lin` | `matas-masys`(8), `saivann-carignan`(6), `tathya-joshi`(4) | 32 |

_652 files in coinbase-www are not covered by any CODEOWNERS rule and aren't in the table above._

---

# Tier 1B: `consumer/react-native` (GHE)

Monorepo for the Coinbase consumer mobile app (iOS + Android via React Native).

- **CDS-importing files:** ≥1,633 (Sourcegraph cap hit)
- **Distinct logical sub-areas with CDS imports:** 109
- **Top repo-wide contributors:** `brendan-lynch`(951), `andrei-calazans`(804), `brandon-domingue`(781)

## Sub-areas ranked by CDS file count

| # | Sub-area | CDS files | Owner team(s) → first members | Top contributors (last 6mo) | Recent commits |
|--:|---|---:|---|---|---:|
| 1 | `src/packages/onboarding/` | 201 | @consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh`<br>@consumer/identity-idv _(stale; rename?: `identity-main`)_ | `jona-frank`(25), `crystal-wang-1`(15), `satyam-srivastava`(13) | 210 |
| 2 | `src/packages/app/src/screens/Send/` | 54 | @consumer/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `sam-morton`(12), `joaopedro-pianta`(7), `justin-taylor-1`(7) | 100 |
| 3 | `src/packages/app/src/screens/Lend/` | 48 | @consumer/defi-lend-frontend _(stale; rename?: `retail-spend-frontend`)_ | `dennis-markovchin-1`(58), `alexander-jakel`(16), `omeid-matten`(5) | 100 |
| 4 | `libs/react-native-core/` | 47 | @consumer/retail-mobile → `robby-barton`, `prashanth-basappa`<br>@consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `crystal-wang-1`(21), `stephen-vergara`(13), `saivann-carignan`(7) | 96 |
| 5 | `src/packages/app/src/screens/Risk/` | 45 | @consumer/risk-platform-eng _(team not on GHE)_ | `drew-paterno`(29), `crystal-wang-1`(14), `david-mkrtchyan`(9) | 100 |
| 6 | `src/packages/app/src/product/aib/` | 43 | @consumer/incentives-aib _(team not on GHE)_ | `taranjitsingh-khokhar`(36), `henrique-ramos`(23), `crystal-wang-1`(8) | 100 |
| 7 | `src/packages/app/src/screens/Receive/` | 32 | @consumer/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `crystal-wang-1`(12), `david-mkrtchyan`(12), `stephen-vergara`(8) | 100 |
| 8 | `src/packages/app/src/screens/SignedOut/` | 30 | @consumer/growth-discovery-and-conversion-frontend → `angela-top`, `james-long` | `crystal-wang-1`(15), `david-mkrtchyan`(13), `anika-hamby`(12) | 100 |
| 9 | `src/packages/app/src/screens/StakingV2/` | 30 | @consumer/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `leon-haggarty`(25), `tanchi-le`(7), `jay-ho`(7) | 100 |
| 10 | `src/packages/app/src/screens/PaymentMethods/` | 27 | @consumer/intl-mobile → `krishnasaijaswanth-rongali`, `jona-frank`<br>@consumer/payments-frontend → `seimon-grando`, `priyansh-gupta` | `crystal-wang-1`(34), `david-mkrtchyan`(20), `stephen-vergara`(16) | 288 |
| 11 | `src/packages/app/src/product/cb1/` | 26 | @consumer/cb1-frontend → `erich-kuerschner`, `rahul-agarwal` | `caitlin-coyiuto`(26), `alessio-symons`(15), `paulafaith-morante`(10) | 100 |
| 12 | `src/packages/app/src/screens/Stablecoin/` | 24 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `crystal-wang-1`(12), `david-mkrtchyan`(12), `dan-nguyen`(8) | 100 |
| 13 | `src/packages/app/src/screens/HomeTab/` | 22 | @consumer/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_<br>@consumer/cash-balances _(team not on GHE)_ | `claudia-ying`(5), `duggan-burke`(4), `weslie-zhang`(4) | 111 |
| 14 | `src/packages/app/src/screens/Asset/` | 22 | @consumer/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff`<br>@consumer/assets-and-balances-frontend → `joanna-lee`, `kyle-baker` | `kavan-wadhwa`(40), `duggan-burke`(15), `ian-chan`(6) | 145 |
| 15 | `src/packages/app/src/screens/VirtualAccounts/` | 21 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `mishall-afzal`(25), `karsten-froemming`(10), `david-mkrtchyan`(7) | 100 |
| 16 | `src/packages/app/src/screens/LimitOrder/` | 20 | @consumer/simple-trade-frontend → `naeim-semsarilar`, `michael-chan` | `crystal-wang-1`(12), `brendan-lynch`(9), `stephen-vergara`(7) | 96 |
| 17 | `src/packages/app/src/screens/RewardsHub/` | 19 | @consumer/growth-incentives-frontend → `james-long`, `chao-chen` | `kyla-yuswanson`(15), `xuhan-liu`(15), `josh-buselt`(13) | 100 |
| 18 | `libs/file-upload-sdk-mobile/` | 18 | @consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `saivann-carignan`(11), `crystal-wang-1`(8), `stephen-vergara`(7) | 63 |
| 19 | `src/packages/app/src/screens/CoinbaseAI/` | 18 | @consumer/next-bets-ai-advisor → `tegh-mehta`, `adrian-lopez-1` | `tegh-mehta`(35), `crystal-wang-1`(13), `stephen-vergara`(7) | 99 |
| 20 | `src/packages/app/src/screens/TradeTabV2/` | 17 | @consumer/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `serra-park`(21), `ian-chan`(12), `tristyn-stimpson`(9) | 100 |
| 21 | `src/packages/app/src/screens/YieldCenter/` | 17 | @consumer/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `crystal-wang-1`(15), `david-mkrtchyan`(11), `leon-haggarty`(6) | 100 |
| 22 | `src/packages/app/src/screens/Pay/` | 16 | @consumer/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `sam-morton`(14), `crystal-wang-1`(14), `justin-taylor-1`(9) | 100 |
| 23 | `src/packages/app/src/components/Transfer/` | 16 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `vrushabh-jambhulkar`(10), `dan-nguyen`(7), `crystal-wang-1`(7) | 116 |
| 24 | `src/packages/app/src/screens/DebitCard/` | 15 | @consumer/creditcard-fe-eng _(team not on GHE)_ | `crystal-wang-1`(14), `tao-alexis`(13), `david-mkrtchyan`(11) | 100 |
| 25 | `src/packages/app/src/screens/Trade/` | 15 | @consumer/simple-trade-frontend → `naeim-semsarilar`, `michael-chan` | `sayali-ashoklagad`(22), `lucas-bernardi`(8), `naeim-semsarilar`(7) | 100 |
| 26 | `src/packages/app/src/screens/PredictionMarkets/` | 11 | @consumer/retail-prediction-markets-frontend _(stale; rename?: `retail-equities-frontend`)_ | `claudia-ying`(25), `chris-nascone`(22), `griffin-sloves`(15) | 100 |
| 27 | `src/packages/app/src/screens/Staking/` | 11 | @consumer/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `eric-copeland`(31), `tanchi-le`(1), `ruikun-hao`(1) | 36 |
| 28 | `src/packages/app/src/components/PaymentMethod/` | 10 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `crystal-wang-1`(8), `stephen-vergara`(8), `matas-masys`(6) | 57 |
| 29 | `src/packages/app/src/screens/Cash/` | 9 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `kaerah-lopez`(15), `karsten-froemming`(9), `dan-nguyen`(7) | 100 |
| 30 | `src/packages/app/src/screens/MarqetaKYC/` | 9 | @consumer/creditcard-fe-eng _(team not on GHE)_ | `crystal-wang-1`(5), `saivann-carignan`(3), `stephen-vergara`(2) | 21 |
| 31 | `src/packages/app/src/screens/Sweepstakes/` | 9 | @consumer/growth-incentives-frontend → `james-long`, `chao-chen` | `crystal-wang-1`(12), `stephen-vergara`(4), `yago-azevedo`(3) | 45 |
| 32 | `src/packages/app/src/screens/CreditCard/` | 8 | @consumer/creditcard-fe-eng _(team not on GHE)_ | `joey-gomezbenito`(26), `dustin-brett`(25), `ruihan-wang`(11) | 100 |
| 33 | `src/packages/app/src/screens/MoreMenu/` | 8 | @consumer/home-and-app-arch-frontend _(stale; rename?: `retail-feed-and-app-arch-frontend`)_ | `crystal-wang-1`(12), `stephen-vergara`(9), `david-mkrtchyan`(7) | 77 |
| 34 | `src/packages/app/src/screens/WrappedAsset/` | 8 | @consumer/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `crystal-wang-1`(6), `stephen-vergara`(6), `david-mkrtchyan`(6) | 41 |
| 35 | `src/packages/app/src/screens/Push2FA/` | 7 | @consumer/identity-frontend _(stale; rename?: `hnwi-frontend`)_ | `nick-janda`(8), `saivann-carignan`(2), `manjiri-moghe`(1) | 17 |
| 36 | `src/packages/app/src/screens/TransactionDetails/` | 7 | @consumer/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `clayton-shaver`(10), `mehmetberke-karadayi`(9), `dan-nguyen`(8) | 100 |
| 37 | `src/packages/app/src/screens/UnifiedSignup/` | 7 | @consumer/identity-frontend _(stale; rename?: `hnwi-frontend`)_ | `anika-hamby`(11), `david-mkrtchyan`(4), `vinicius-marson`(3) | 34 |
| 38 | `src/packages/app/src/components/TwoFactor/` | 6 | @consumer/identity-frontend _(stale; rename?: `hnwi-frontend`)_ | `anika-hamby`(6), `david-mkrtchyan`(3), `stephen-vergara`(3) | 21 |
| 39 | `src/packages/app/src/product/incentive/` | 6 | @consumer/growth-incentives-frontend → `james-long`, `chao-chen` | `xuhan-liu`(27), `bhav-chauhan`(18), `crystal-wang-1`(11) | 100 |
| 40 | `src/packages/app/src/screens/AssetsTab/` | 6 | @consumer/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `crystal-wang-1`(7), `duggan-burke`(6), `dang-nguyen`(6) | 100 |
| 41 | `src/packages/app/src/screens/Onramp/` | 6 | @consumer/cbpay → `yao-ma`, `bo-lei` | `crystal-wang-1`(4), `saivann-carignan`(2), `Gabriel Taveira`(2) | 14 |
| 42 | `src/packages/app/src/screens/AdvancedTrade/` | 6 | @consumer/advanced-trading-mobile → `jona-frank`, `naeim-semsarilar`<br>@consumer/advanced-trading-spot-mobile → `hunter-copp`, `stacy-sun` | `david-mkrtchyan`(22), `crystal-wang-1`(21), `matas-masys`(15) | 200 |
| 43 | `packages/webview-preloaded/` | 5 | @consumer/identity-frontend _(stale; rename?: `hnwi-frontend`)_ | `anika-hamby`(9), `brandon-domingue`(4) | 15 |
| 44 | `src/packages/app/src/screens/Gamification/` | 5 | @consumer/growth-incentives-frontend → `james-long`, `chao-chen` | `james-long`(15), `kiwook-kwon`(13), `xuhan-liu`(10) | 74 |
| 45 | `src/packages/app/src/screens/SubscriptionPreferences/` | 5 | @consumer/cb1-frontend → `erich-kuerschner`, `rahul-agarwal` | `crystal-wang-1`(6), `matas-masys`(4), `saivann-carignan`(4) | 28 |
| 46 | `src/packages/app/src/screens/TradeTab/` | 5 | @consumer/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `lawrence-good`(8), `stephen-vergara`(6), `sayali-ashoklagad`(5) | 78 |
| 47 | `src/packages/app/src/utils/suspenseInspector/` | 5 | @consumer/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `crystal-wang-1`(3), `stephen-vergara`(3), `Gabriel Taveira`(2) | 12 |
| 48 | `src/packages/app/src/screens/Settings/` | 5 | @consumer/advanced-trading-mobile → `jona-frank`, `naeim-semsarilar`<br>@consumer/cash-balances _(team not on GHE)_ | `crystal-wang-1`(19), `elijah-quartey`(18), `greg-alway`(12) | 136 |
| 49 | `libs/proof-of-any-rn/` | 4 | @consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `saivann-carignan`(6), `hemny-singh`(4), `crystal-wang-1`(3) | 20 |
| 50 | `src/packages/app/src/components/HTMLRenderer/` | 4 | @consumer/home-and-app-arch-frontend _(stale; rename?: `retail-feed-and-app-arch-frontend`)_ | `crystal-wang-1`(5), `loui-zibdawi`(4), `saivann-carignan`(3) | 29 |
| 51 | `src/packages/app/src/components/Transaction/` | 4 | @consumer/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `stephen-vergara`(5), `david-mkrtchyan`(4), `Gabriel Taveira`(3) | 21 |
| 52 | `src/packages/app/src/product/hnwi/` | 4 | @consumer/hnwi-frontend → `rahul-agarwal`, `travis-bloom` | `brian-kasper`(42), `david-mkrtchyan`(7), `vrushabh-jambhulkar`(5) | 100 |
| 53 | `src/packages/app/src/screens/AddPaymentMethod/` | 4 | @consumer/payments-frontend → `seimon-grando`, `priyansh-gupta` | `sachin-raghuwanshi`(16), `crystal-wang-1`(10), `saivann-carignan`(8) | 100 |
| 54 | `src/packages/app/src/screens/BoostSeason/` | 4 | @consumer/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `crystal-wang-1`(8), `stephen-vergara`(4), `yago-azevedo`(3) | 25 |
| 55 | `src/packages/app/src/screens/DefiBorrow/` | 4 | @consumer/retail-defi-borrow → `siva-vasanth`, `joseph-moyalan` | `natasha-wong`(30), `steven-psomas`(15), `benson-budiman`(4) | 100 |
| 56 | `src/packages/app/src/screens/P2PEducationFlow/` | 4 | @consumer/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `stephen-vergara`(4), `lawrence-good`(1), `david-mkrtchyan`(1) | 10 |
| 57 | `src/packages/app/src/screens/Performance/` | 4 | @consumer/assets-and-balances-frontend → `joanna-lee`, `kyle-baker` | `duggan-burke`(5), `crystal-wang-1`(5), `stephen-vergara`(4) | 27 |
| 58 | `src/packages/app/src/screens/Raise/` | 4 | @consumer/raise _(stale; rename?: `prime`)_ | `raj-jain-1`(16), `houan-lin`(13), `joe-cuffney`(13) | 100 |
| 59 | `src/packages/app/src/screens/AdvocacyContentHub/` | 3 | @consumer/growth-advocacy → `alvaro-raminelli`, `lucas-bernardi` | `crystal-wang-1`(19), `stephen-vergara`(11), `david-mkrtchyan`(11) | 78 |
| 60 | `src/packages/app/src/screens/AssetRewardCenter/` | 3 | @consumer/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `eric-copeland`(23), `matheushenrique-araujomendes`(11), `leon-haggarty`(10) | 100 |
| 61 | `src/packages/app/src/screens/Clawback/` | 3 | @consumer/payments-risk-eng _(stale; rename?: `ato-risk-eng`)_ | `crystal-wang-1`(6), `matas-masys`(5), `stephen-vergara`(5) | 38 |
| 62 | `src/packages/app/src/screens/ExploreTab/` | 3 | @consumer/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `crystal-wang-1`(9), `saivann-carignan`(5), `david-mkrtchyan`(5) | 75 |
| 63 | `src/packages/app/src/screens/OAuthConsent/` | 3 | @consumer/identity-frontend _(stale; rename?: `hnwi-frontend`)_ | `joao-tonial`(4) | 4 |
| 64 | `src/packages/app/src/screens/UniversalSearch/` | 3 | @consumer/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `stephen-vergara`(8), `crystal-wang-1`(6), `weslie-zhang`(4) | 59 |
| 65 | `src/packages/app/src/screens/Debug/` | 3 | @consumer/dx-mobile-guild → `bruno-capezzali`, `alfonso-curbelo`<br>@consumer/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `crystal-wang-1`(2), `manjiri-moghe`(1), `alessio-symons`(1) | 4 |
| 66 | `libs/unified-onboarding-rn/` | 2 | @consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `satyam-srivastava`(7), `saivann-carignan`(4), `samuel-han`(3) | 25 |
| 67 | `src/packages/app/src/components/Notifications/` | 2 | @consumer/notifications-frontend → `elijah-quartey`, `yash-desai` | `elijah-quartey`(26), `greg-alway`(16), `stephen-vergara`(4) | 73 |
| 68 | `src/packages/app/src/components/StatusAlerts/` | 2 | @consumer/home-and-app-arch-frontend _(stale; rename?: `retail-feed-and-app-arch-frontend`)_ | `crystal-wang-1`(4), `stephen-vergara`(2), `saivann-carignan`(2) | 11 |
| 69 | `src/packages/app/src/components/UpsellFramework/` | 2 | @consumer/notifications-frontend → `elijah-quartey`, `yash-desai` | `crystal-wang-1`(24), `david-mkrtchyan`(23), `stephen-vergara`(10) | 86 |
| 70 | `src/packages/app/src/screens/AppToApp/` | 2 | @consumer/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `crystal-wang-1`(4), `saivann-carignan`(2), `stephen-vergara`(2) | 12 |
| 71 | `src/packages/app/src/screens/Defi/` | 2 | @consumer/retail-dapps-frontend → `akash-gupta-1`, `asutosh-dhakal` | `crystal-wang-1`(9), `david-mkrtchyan`(7), `stephen-vergara`(7) | 45 |
| 72 | `src/packages/app/src/screens/Equities/` | 2 | @consumer/retail-equities-frontend → `naeim-semsarilar`, `michael-chan` | `colin-johnson`(17), `michael-chan`(14), `james-zhang`(9) | 100 |
| 73 | `src/packages/app/src/screens/FiatTransfer/` | 2 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `dan-nguyen`(21), `kaerah-lopez`(10), `ian-yeo`(8) | 100 |
| 74 | `src/packages/app/src/screens/IdentityAccess/` | 2 | @consumer/identity-frontend _(stale; rename?: `hnwi-frontend`)_ | `anika-hamby`(10), `ruikun-hao`(1), `xuhan-liu`(1) | 16 |
| 75 | `src/packages/app/src/screens/Notifications/` | 2 | @consumer/notifications-frontend → `elijah-quartey`, `yash-desai` | `elijah-quartey`(14), `crystal-wang-1`(10), `greg-alway`(6) | 78 |
| 76 | `src/packages/app/src/screens/SubscriptionSignup/` | 2 | @consumer/cb1-frontend → `erich-kuerschner`, `rahul-agarwal` | `caitlin-coyiuto`(12), `crystal-wang-1`(8), `bhav-chauhan`(7) | 71 |
| 77 | `src/packages/app/src/components/navigation/` | 2 | @consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh`<br>@consumer/home-and-app-arch-frontend _(stale; rename?: `retail-feed-and-app-arch-frontend`)_ | `weslie-zhang`(6), `drew-paterno`(3), `david-mkrtchyan`(3) | 45 |
| 78 | `src/packages/app/src/components/AssetAnnotations/` | 1 | @consumer/notifications-frontend → `elijah-quartey`, `yash-desai` | `greg-alway`(36), `saivann-carignan`(3), `akram-nour`(2) | 58 |
| 79 | `src/packages/app/src/components/BaseErrorFallback.tsx/` | 1 | @consumer/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `saivann-carignan`(1), `stacy-sun`(1), `crystal-wang-1`(1) | 3 |
| 80 | `src/packages/app/src/components/BoostSeasonTray/` | 1 | @consumer/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `loui-zibdawi`(1), `yago-azevedo`(1), `vrushabh-jambhulkar`(1) | 8 |
| 81 | `src/packages/app/src/components/CB1NudgeTray/` | 1 | @consumer/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `loui-zibdawi`(1), `yago-azevedo`(1), `vrushabh-jambhulkar`(1) | 8 |
| 82 | `src/packages/app/src/components/ErrorBoundary.tsx/` | 1 | @consumer/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `brandon-domingue`(2), `tristyn-stimpson`(1), `loui-zibdawi`(1) | 7 |
| 83 | `src/packages/app/src/components/GlobalActions/` | 1 | @consumer/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `crystal-wang-1`(4), `stephen-vergara`(2), `saivann-carignan`(2) | 12 |
| 84 | `src/packages/app/src/components/PaymentMethodsTray.tsx/` | 1 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `kaerah-lopez`(1), `loui-zibdawi`(1), `edward-brodski`(1) | 8 |
| 85 | `src/packages/app/src/components/ScreenBoundary/` | 1 | @consumer/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `dang-nguyen`(5), `colin-johnson`(5), `eric-copeland`(4) | 100 |
| 86 | `src/packages/app/src/components/SystemAlert/` | 1 | @consumer/home-and-app-arch-frontend _(stale; rename?: `retail-feed-and-app-arch-frontend`)_ | `harshil-shah`(3), `crystal-wang-1`(2), `ruikun-hao`(1) | 23 |
| 87 | `src/packages/app/src/components/TabRootScreen.tsx/` | 1 | @consumer/home-and-app-arch-frontend _(stale; rename?: `retail-feed-and-app-arch-frontend`)_ | `weslie-zhang`(3), `stephen-vergara`(2), `greg-alway`(1) | 10 |
| 88 | `src/packages/app/src/components/subscription/` | 1 | @consumer/cb1-frontend → `erich-kuerschner`, `rahul-agarwal` | `alessio-symons`(5), `crystal-wang-1`(5), `bhav-chauhan`(5) | 59 |
| 89 | `src/packages/app/src/hooks/resource/` | 1 | @consumer/asset-discovery-frontend _(stale; rename?: `discovery-research-frontend`)_ | `ian-chan`(11), `weslie-zhang`(4), `ruikun-hao`(1) | 22 |
| 90 | `src/packages/app/src/hooks/useContentfulP2PEducationFlow.ts/` | 1 | @consumer/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `david-mkrtchyan`(1), `saivann-carignan`(1) | 2 |
| 91 | `src/packages/app/src/hooks/useGrowthDerivativesAckModal.tsx/` | 1 | @consumer/advanced-trading-intx-mobile _(stale; rename?: `advanced-trading-mobile`)_ | `david-mkrtchyan`(4), `stephen-vergara`(2), `Gabriel Taveira`(2) | 10 |
| 92 | `src/packages/app/src/hooks/useUnifiedLoginLauncher.tsx/` | 1 | @consumer/identity-frontend _(stale; rename?: `hnwi-frontend`)_ | `anika-hamby`(7), `manjiri-moghe`(2), `saivann-carignan`(2) | 13 |
| 93 | `src/packages/app/src/screens/Account/` | 1 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey`<br>@consumer/cash-balances _(team not on GHE)_ | `taranjitsingh-khokhar`(3), `dan-nguyen`(2), `tae-yoon`(2) | 18 |
| 94 | `src/packages/app/src/screens/AccountChecklist/` | 1 | @consumer/growth-activation _(stale; rename?: `growth-notifications`)_ | `stephen-vergara`(7), `crystal-wang-1`(7), `saivann-carignan`(5) | 60 |
| 95 | `src/packages/app/src/screens/Attributions/` | 1 | @consumer/retail-app-infra → `brandon-domingue`, `andrei-calazans` | `reed-williams`(5), `dang-nguyen`(4), `manjiri-moghe`(3) | 34 |
| 96 | `src/packages/app/src/screens/BalanceSummary/` | 1 | @consumer/assets-and-balances-frontend → `joanna-lee`, `kyle-baker` | `serra-park`(22), `stephen-vergara`(10), `duggan-burke`(7) | 87 |
| 97 | `src/packages/app/src/screens/Campaign/` | 1 | @consumer/growth-activation _(stale; rename?: `growth-notifications`)_ | `saivann-carignan`(2), `crystal-wang-1`(2), `brendan-lynch`(1) | 13 |
| 98 | `src/packages/app/src/screens/CashBalance/` | 1 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey`<br>@consumer/cash-balances _(team not on GHE)_ | `dan-nguyen`(15), `ilia-shilov`(5), `anthony-tersaakov`(4) | 60 |
| 99 | `src/packages/app/src/screens/CryptoBalance/` | 1 | @consumer/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `ilia-shilov`(5), `duggan-burke`(4), `taranjitsingh-khokhar`(3) | 54 |
| 100 | `src/packages/app/src/screens/Onboarding/` | 1 | @consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `satyam-srivastava`(7), `akash-gupta-1`(5), `matheus-palma`(5) | 100 |
| 101 | `src/packages/app/src/screens/OnboardingRedirect/` | 1 | @consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `saivann-carignan`(1) | 1 |
| 102 | `src/packages/app/src/screens/PolicyRestrictions/` | 1 | @consumer/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `drew-paterno`(4), `crystal-wang-1`(3), `david-mkrtchyan`(3) | 33 |
| 103 | `src/packages/app/src/screens/ReferralHub/` | 1 | @consumer/growth-referrals-frontend → `chao-chen`, `shraddha-pathradkar` | `chao-chen`(23), `keith-low`(14), `crystal-wang-1`(14) | 100 |
| 104 | `src/packages/app/src/screens/RequestEnterNoteScreen.tsx/` | 1 | @consumer/retail-p2p-frontend → `kaerah-lopez`, `yumeng-xu` | `stephen-vergara`(2), `matas-masys`(2), `crystal-wang-1`(1) | 5 |
| 105 | `src/packages/app/src/screens/StakingGrowth/` | 1 | @consumer/retail-financing-defi-frontend → `adam-lessey`, `timothy-wang` | `leon-haggarty`(23), `jay-ho`(9), `tanchi-le`(6) | 100 |
| 106 | `src/packages/app/src/screens/SubscriptionManagement/` | 1 | @consumer/cb1-frontend → `erich-kuerschner`, `rahul-agarwal` | `crystal-wang-1`(14), `caitlin-coyiuto`(14), `paulafaith-morante`(9) | 100 |
| 107 | `src/packages/app/src/screens/Transactions/` | 1 | @consumer/simple-assets-frontend → `nathaniel-mallet`, `tk-yussuff` | `giuseppe-barillari`(4), `michael-chan`(4), `stephen-vergara`(2) | 19 |
| 108 | `src/packages/app/src/screens/UniversalCash/` | 1 | @consumer/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `akash-gupta-1`(4), `yago-azevedo`(3), `stephen-vergara`(3) | 31 |
| 109 | `src/packages/app/src/utils/i18n/` | 1 | @consumer/intl-mobile → `krishnasaijaswanth-rongali`, `jona-frank` | `saivann-carignan`(4), `david-mkrtchyan`(2), `Gabriel Taveira`(2) | 14 |

_509 files in consumer/react-native are not covered by any CODEOWNERS rule._

---

# Tier 2/3: Other consumer repos, ranked by CDS footprint

Single-purpose repos (not the two big monorepos), ranked by `# package.json files declaring CDS deps × CDS package diversity`. Use as migration order *after* Tier 1.

### Tier 2 (large/diverse: ≥3 `package.json` files declaring CDS, OR ≥4 distinct CDS packages used)

| # | Repo | CDS pkg.json files | Distinct CDS pkgs | Owner | Top members | Top contributors | Last commit |
|--:|---|---:|---:|---|---|---|---|
| 1 | `coinbase.ghe.com/identity/frontend` | 24 | 4 | @identity/identity-frontend | @identity/identity-frontend → `robby-barton`, `prashanth-basappa` | `nick-janda`(1213), `joao-tonial`(981), `anika-hamby`(444) | 2026-04-25 |
| 2 | `coinbase.ghe.com/frontend/internal` | 23 | 3 | @frontend/eng _(path-scoped)_ | @frontend/eng → `bob-glickstein`, `ekant-bajaj` | `leon-haggarty`(1486), `bryant-gallardo`(454), `guilherme-luersen`(292) | 2026-04-24 |
| 3 | `coinbase.ghe.com/frontend/cds-internal` _(CDS itself)_ | 17 | 6 | @frontend/ui-systems-eng-team | @frontend/ui-systems-eng-team → `hunter-copp`, `ruikun-hao` | `cody-nova`(60), `adrien-zheng`(51), `hunter-copp`(46) | 2026-03-18 |
| 4 | `coinbase.ghe.com/frontend/cds-public` _(CDS itself)_ | 17 | 6 | @coinbase/ui-systems-eng-team | @coinbase/ui-systems-eng-team _(team not on GHE)_ | `adrien-zheng`(44), `ruikun-hao`(26), `cody-nova`(25) | 2026-03-18 |
| 5 | `coinbase.ghe.com/coinbase-internal/docs` | 17 | 3 | _(no CODEOWNERS)_ |  | `miles-johnson`(215), `ismail-syed`(117), `cooper-willetts`(91) | 2026-04-24 |
| 6 | `coinbase.ghe.com/wallet/wallet-mobile` | 13 | 6 | @wallet/wallet | @wallet/wallet → `ekant-bajaj`, `jona-frank` | `alex-shoykhet`(1588), `donny-li`(1282), `rafael-camara`(772) | 2026-04-25 |
| 7 | `coinbase.ghe.com/eaa-eng/cms` | 9 | 4 | @eaa-eng/eaa-marketing / @eaa-eng/growth-acquisition-frontend | @eaa-eng/eaa-marketing → `askat-bakyev`, `jacob-moore`<br>@eaa-eng/growth-acquisition-frontend _(stale; rename?: `growth-incentives-frontend`)_ | `askat-bakyev`(271), `andrew-mundy`(266), `cody-nova`(260) | 2026-04-22 |
| 8 | `coinbase.ghe.com/finhub/finhub-ui` | 9 | 4 | @finhub/tax-eng _(path-scoped)_ | @finhub/tax-eng → `raaghav-raaj`, `yash-jobanputra` | `aneri-shah`(490), `kartik-kapoor`(341), `sreevatsa-acharya`(187) | 2026-04-23 |
| 9 | `coinbase.ghe.com/institutional/frontend` | 6 | 4 | @institutional/prime-fe-bar-raisers | @institutional/prime-fe-bar-raisers _(stale; rename?: `payment-method-service-bar-raisers`)_ | `matthew-catellier`(1110), `saulo-marchi`(1019), `philip-wu`(933) | 2026-04-25 |
| 10 | `coinbase.ghe.com/wallet/apps` | 6 | 3 | @wallet/wallet-build-squad _(path-scoped)_ | @wallet/wallet-build-squad _(team not on GHE)_ | `jake-feldman`(94), `bassim-sadik`(56), `vishnu-madhusoodanan`(32) | 2026-04-24 |
| 11 | `coinbase.ghe.com/frontend/incentives` | 5 | 5 | @frontend/growth-incentives-frontend | @frontend/growth-incentives-frontend → `james-long`, `chao-chen` | `josh-buselt`(33), `kyla-yuswanson`(15), `clinton-reece`(1) | 2026-04-14 |
| 12 | `coinbase.ghe.com/data/cb-chat-ui` | 5 | 4 | @data/cb-chat-frontend | @data/cb-chat-frontend → `philip-bozak`, `anshul-goyal` | `dinesh-kathuria`(135), `rahul-agarwal`(100), `brian-kasper`(74) | 2026-04-23 |
| 13 | `coinbase.ghe.com/frontend/notifications` | 5 | 4 | @frontend/notifications-frontend | @frontend/notifications-frontend → `elijah-quartey`, `yash-desai` | `greg-alway`(144), `bryant-gallardo`(57), `royce-brooks`(42) | 2026-04-14 |
| 14 | `coinbase.ghe.com/commerce/frontend` | 5 | 3 | @commerce/commerce _(path-scoped)_ | @commerce/commerce → `sam-luo`, `stacy-sun` | `andrew-reder`(404), `lukas-rosario`(154), `tae-yoon`(110) | 2026-04-01 |
| 15 | `coinbase.ghe.com/frontend/wem` | 4 | 4 | @frontend/onboarding-experiences | @frontend/onboarding-experiences → `prashanth-basappa`, `debashish-ghosh` | `angela-top`(33), `linh-le`(28), `umar-bolatov`(27) | 2026-04-21 |
| 16 | `coinbase.ghe.com/payments/config-driven-ui-sdk` | 4 | 4 | @payments/payments-frontend _(path-scoped)_ | @payments/payments-frontend → `seimon-grando`, `priyansh-gupta` | `sachin-raghuwanshi`(6), `faustino-cortina`(4), `celso-saad`(1) | 2026-04-08 |
| 17 | `coinbase.ghe.com/payments/unified-payment-methods` | 4 | 4 | @payments/cash-frontend _(path-scoped)_ | @payments/cash-frontend → `kaerah-lopez`, `taylor-lindsey` | `faustino-cortina`(82), `jeff-tan`(21), `sachin-raghuwanshi`(11) | 2026-04-21 |
| 18 | `coinbase.ghe.com/it/portal` | 4 | 3 | @it/it-eng-all | @it/it-eng-all → `ryan-goodwin`, `johan-mcgwire` | `johan-mcgwire`(164), `jessica-hartono`(30), `alex-bard`(25) | 2026-04-24 |
| 19 | `coinbase.ghe.com/risk/challenges-frontend` | 4 | 3 | @risk/risk-platform-eng | @risk/risk-platform-eng → `mingshuo-zhang`, `weiting-hsu` | `mingshuo-zhang`(138), `amir-makhshari`(1), `jonathan-bergknoff`(1) | 2026-04-24 |
| 20 | `coinbase.ghe.com/frontend/cds` _(CDS itself)_ | 3 | 4 | @frontend/ui-systems-eng-team | @frontend/ui-systems-eng-team → `hunter-copp`, `ruikun-hao` | `cody-nova`(236), `siddharth-kulkarni`(181), `miles-johnson`(171) | 2026-03-16 |
| 21 | `coinbase.ghe.com/frontend/iris` | 3 | 4 | @frontend/growth-foundations | @frontend/growth-foundations → `nichil-stewart`, `kai-guo` | `leon-haggarty`(1405), `bryant-gallardo`(649), `yang-qing`(372) | 2026-04-24 |
| 22 | `coinbase.ghe.com/infra/reliability-frontend` | 3 | 4 | @infra/reliability-core _(path-scoped)_ | @infra/reliability-core → `sarmad-shah`, `abdullah-arif` | `sarmad-shah`(183), `kyle-zhu`(88), `ankur-mittal`(56) | 2026-04-23 |
| 23 | `coinbase.ghe.com/it/zero-trust-insight` | 3 | 4 | @it/it-set-security | @it/it-set-security → `johan-mcgwire`, `shawn-marck` | `kris-peterson`(2), `dikshit-khandelwal`(1), `fawaz-chaudhry`(1) | 2026-04-22 |
| 24 | `coinbase.ghe.com/frontend/dynamic-presentation` | 3 | 3 | @frontend/search-and-explore-frontend | @frontend/search-and-explore-frontend → `nichil-stewart`, `jay-sullivan` | `ej-morgan`(34), `joel-paulino`(8), `jaime-biernaski`(6) | 2026-04-08 |
| 25 | `coinbase.ghe.com/intl/payments-web` | 3 | 3 | @intl/intl-latam | @intl/intl-latam → `carlos-cardosodias`, `luis-lourenco` | `joaopedro-pianta`(11) | 2026-04-23 |
| 26 | `coinbase.ghe.com/frontend/cds-design` _(CDS itself)_ | 2 | 6 | @cbhq/ui-systems-eng-team | @cbhq/ui-systems-eng-team _(team not on GHE)_ | `cody-nova`(1) | 2026-04-15 |
| 27 | `coinbase.ghe.com/frontend/cds-playground` _(CDS itself)_ | 2 | 6 | @frontend/ui-systems-eng-team | @frontend/ui-systems-eng-team → `hunter-copp`, `ruikun-hao` | `ruikun-hao`(118), `hunter-copp`(11), `lily-yin`(4) | 2026-04-23 |
| 28 | `coinbase.ghe.com/frontend/mckay-testing` | 2 | 6 | @frontend/ui-systems-eng-team | @frontend/ui-systems-eng-team → `hunter-copp`, `ruikun-hao` | `ruikun-hao`(118), `hunter-copp`(11), `adrien-zheng`(1) | 2026-04-20 |
| 29 | `coinbase.ghe.com/frontend/examples` | 2 | 5 | _(no CODEOWNERS)_ |  | `jeff-tan`(41), `miles-johnson`(12), `wayne-zhang`(8) | 2026-04-23 |
| 30 | `coinbase.ghe.com/c3/node-hub` | 2 | 4 | @c3/node-hub | @c3/node-hub → `zhenwei-wang`, `wen-miao` | `wen-miao`(47), `bryan-potter`(21), `andrew-wolfe`(16) | 2026-04-13 |
| 31 | `coinbase.ghe.com/cloud/frontend` | 2 | 4 | @cloud/cdp-portal-approvers | @cloud/cdp-portal-approvers → `sangwoo-kim`, `lakshay-sharma` | `andrew-kowalczyk`(224), `jeremy-odell`(188), `andrew-wiggin`(163) | 2026-04-24 |
| 32 | `coinbase.ghe.com/eaa-eng/control-center-frontend` | 2 | 4 | @eaa-eng/eaa-customer-administration-engineering | @eaa-eng/eaa-customer-administration-engineering → `shivam-tayal`, `clara-kwan` | `matheus-moreira`(144), `lucasalexander-floriani`(98), `andreluiz-cardosodacosta`(98) | 2026-04-24 |
| 33 | `coinbase.ghe.com/eaa-eng/esto-ai-tracker` | 2 | 4 | @eaa-eng/eaa-marketing | @eaa-eng/eaa-marketing → `askat-bakyev`, `jacob-moore` | `jason-dodds`(36) | 2026-04-23 |
| 34 | `coinbase.ghe.com/frontend/data-layer` | 2 | 4 | @frontend/data-layer | @frontend/data-layer → `stephanie-saunders`, `wayne-zhang` | `wayne-zhang`(218), `tyler-martinez`(175), `stephanie-saunders`(18) | 2026-04-22 |
| 35 | `coinbase.ghe.com/frontend/mobile` | 2 | 4 | @frontend/dx-mobile-guild | @frontend/dx-mobile-guild → `bruno-capezzali`, `alfonso-curbelo` | `alfonso-curbelo`(183), `bruno-capezzali`(164), `ismail-syed`(43) | 2026-04-23 |
| 36 | `coinbase.ghe.com/institutional/arceus` | 2 | 4 | @institutional/credit-risk-eng | @institutional/credit-risk-eng → `ritesh-kumar`, `yash-sharma-1` | `jithin-nair`(231), `ritesh-kumar`(158), `himanshu-mehta`(118) | 2026-04-24 |
| 37 | `coinbase.ghe.com/security/access-portal` | 2 | 4 | @security/security-platform-eng-access-portal-repo-write _(path-scoped)_ | @security/security-platform-eng-access-portal-repo-write _(team not on GHE)_ | `rashelle-hopkins`(238), `mikias-mohamed`(56), `kartik-kapoor`(45) | 2026-04-24 |

### Tier 3 (smaller: 1-2 `package.json` files, ≤3 distinct CDS pkgs)

Bulk-migrate via codemod once Tier 1+2 patterns are stable. Sorted alphabetically.

| Repo | # files | CDS pkgs | Owner | Last commit |
|---|---:|---|---|---|
| `coinbase.ghe.com/bootcamp/bootcamptest` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/bootcamp/bounty-smart-contract-frontend` | 1 | 3 | @bootcamp/bootcamp-project | 2026-04-09 |
| `coinbase.ghe.com/c3/agents-marketplace-frontend` | 1 | 3 | @protocols/web3-protocols | 2026-04-20 |
| `coinbase.ghe.com/c3/ai-trading-arena` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-15 |
| `coinbase.ghe.com/c3/asset-data-admin` | 1 | 3 | @c3/asset-infra | 2026-04-15 |
| `coinbase.ghe.com/c3/assets-transformation-platform-ui` | 1 | 3 | @c3/asset-transformation-platform-admin | 2026-04-15 |
| `coinbase.ghe.com/c3/bdp-agent-frontend` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/c3/bdp-frontend` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-22 |
| `coinbase.ghe.com/c3/blockchain-processing-frontend` | 1 | 3 | @c3/data-cdf _(path-scoped)_ | 2026-04-24 |
| `coinbase.ghe.com/c3/cdp-wallet` | 1 | 3 | @c3/cdp-platform-api-eng | 2026-04-24 |
| `coinbase.ghe.com/c3/cdp-web-demo` | 1 | 3 | @c3/cdp-platform-api-eng | 2026-04-13 |
| `coinbase.ghe.com/c3/clear-pools-ui` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-08 |
| `coinbase.ghe.com/c3/grimoire` | 2 | 2 | @c3/blockchain-platform-ai-devx | 2026-04-24 |
| `coinbase.ghe.com/c3/houston` | 1 | 4 | @c3/crypto | 2026-04-24 |
| `coinbase.ghe.com/c3/houston-v2-prototype` | 1 | 1 | @c3/crypto-scalability / @c3/crypto-assets | 2026-04-17 |
| `coinbase.ghe.com/c3/interoperability-platform` | 1 | 2 | @c3/liquidity-bridging | 2026-04-24 |
| `coinbase.ghe.com/c3/oncall-agents` | 1 | 2 | @c3/blockchain-platform-ai-devx | 2026-04-24 |
| `coinbase.ghe.com/c3/onchain-indexer-gui` | 1 | 3 | @c3/cdp-data | 2026-04-20 |
| `coinbase.ghe.com/c3/pm-bar-raiser-tool` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-13 |
| `coinbase.ghe.com/c3/test-runner` | 1 | 2 | @c3/crypto-reliability | 2026-04-01 |
| `coinbase.ghe.com/c3/trading-arena` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/c3/x402-marketplace-frontend` | 1 | 3 | @c3/base-dev-eng | 2026-04-08 |
| `coinbase.ghe.com/c3/x402-playground` | 1 | 3 | @c3/x402-eng | 2026-04-24 |
| `coinbase.ghe.com/cloud/build-quest` | 1 | 3 | @cloud/cb-cloud-frontend | 2026-04-15 |
| `coinbase.ghe.com/cloud/delegate-ui` | 1 | 4 | @cloud/cb-cloud-eng-staking | 2026-04-17 |
| `coinbase.ghe.com/coinbase-internal/lineart` | 1 | 3 | @exchange/exchange-eng | 2026-04-17 |
| `coinbase.ghe.com/commerce/payment-account-portal` | 2 | 2 | @commerce/commerce | 2026-04-15 |
| `coinbase.ghe.com/commerce/payments-mcp` | 1 | 3 | @commerce/commerce | 2026-04-23 |
| `coinbase.ghe.com/consumer/Search-and-Discovery` | 1 | 1 | _(no CODEOWNERS)_ | 2026-04-16 |
| `coinbase.ghe.com/consumer/bedrock-pr-review-test` | 1 | 2 | _(no CODEOWNERS)_ | 2026-04-15 |
| `coinbase.ghe.com/consumer/design-review` | 1 | 1 | _(no CODEOWNERS)_ | 2026-04-22 |
| `coinbase.ghe.com/consumer/incident-dashboard` | 1 | 3 | @consumer/technology_governance | 2026-04-09 |
| `coinbase.ghe.com/consumer/messaging-chatbot-service` | 1 | 3 | @consumer/web3-communities-backend | 2026-04-03 |
| `coinbase.ghe.com/consumer/quicksand` | 2 | 3 | @consumer/creditcard-eng | 2026-04-15 |
| `coinbase.ghe.com/consumer/raid-sandbox` | 1 | 3 | @consumer/ai-pr-reviewer | 2026-04-15 |
| `coinbase.ghe.com/consumer/swc-ai` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-13 |
| `coinbase.ghe.com/consumer/test2` | 1 | 3 | @consumer/technology_governance | 2026-04-10 |
| `coinbase.ghe.com/custody/custody-automation-frontend` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/data/access-portal` | 1 | 3 | @security/security-platform-eng-access-portal-repo-write _(path-scoped)_ | 2026-01-06 |
| `coinbase.ghe.com/data/ai-accel-legal` | 1 | 2 | @data/ai-accelerator | 2026-04-23 |
| `coinbase.ghe.com/data/ai-accel-service` | 1 | 1 | @data/cb-gpt-service-core / @data/ai-acceleration-contractors | 2026-04-24 |
| `coinbase.ghe.com/data/bk-physsec` | 1 | 3 | @data/security-physical-operations | 2026-04-23 |
| `coinbase.ghe.com/data/cb-gpt-frontend` | 2 | 3 | @data/cb-gpt-service-core | 2026-04-02 |
| `coinbase.ghe.com/data/coinbase-agents-landing` | 1 | 3 | @data/ai-accelerator | 2026-04-15 |
| `coinbase.ghe.com/data/coinbase-agents-splash` | 1 | 3 | @data/ai-accelerator | 2026-04-15 |
| `coinbase.ghe.com/data/compliance-agents` | 2 | 1 | @data/cb-gpt-compliance-core | 2026-04-24 |
| `coinbase.ghe.com/data/frontend` | 1 | 3 | @data/data-platform | 2026-04-26 |
| `coinbase.ghe.com/data/helpcenter-web` | 1 | 3 | @data/support-experience | 2026-04-24 |
| `coinbase.ghe.com/data/intelagent` | 1 | 3 | @data/security-physical-operations | 2026-04-21 |
| `coinbase.ghe.com/data/pynest` | 1 | 3 | @data/data-data-engineering-approvers _(path-scoped)_ | 2026-04-27 |
| `coinbase.ghe.com/data/pynest-mirror` | 1 | 3 | @data/data-data-engineering-approvers _(path-scoped)_ | 2026-04-23 |
| `coinbase.ghe.com/data/staking-performance` | 1 | 3 | @data/data-data-engineering-approvers | 2026-04-24 |
| `coinbase.ghe.com/data/tracer-ui` | 1 | 4 | @data/tracer | 2026-04-24 |
| `coinbase.ghe.com/data/vms` | 1 | 3 | @data/security-physical-operations | 2026-04-23 |
| `coinbase.ghe.com/dcm/cde-ui` | 1 | 4 | @dcm/dcm-admins / @dcm/dcm-ui | 2026-04-24 |
| `coinbase.ghe.com/eaa-eng/agent-cockpit` | 1 | 3 | @eaa-eng/eaa-agent-productivity-tools | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/archer-intelligence` | 1 | 3 | @eaa-eng/eaa-customer-agent-interaction-systems | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/athena` | 1 | 2 | @data/support-experience | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/audit-finding-platform` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-24 |
| `coinbase.ghe.com/eaa-eng/b2b-salesforce-support-canvas` | 1 | 3 | @eaa-eng/eaa-eng | 2026-04-09 |
| `coinbase.ghe.com/eaa-eng/captain` | 1 | 3 | @eaa-eng/eaa-customer-administration-engineering | 2026-04-24 |
| `coinbase.ghe.com/eaa-eng/circa` | 1 | 2 | @eaa-eng/eaa-onboarding | 2026-04-24 |
| `coinbase.ghe.com/eaa-eng/cockpit-consumer` | 2 | 3 | @eaa-eng/eaa-consumer-cxae | 2026-04-24 |
| `coinbase.ghe.com/eaa-eng/concierge-ops-dashboard` | 2 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/contentful-ide-plugin` | 2 | 3 | @eaa-eng/eaa-marketing | 2026-04-22 |
| `coinbase.ghe.com/eaa-eng/contentful-legal-agreements` | 1 | 2 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/eaa-eng/cx-analytics-tools` | 1 | 3 | @eaa-eng/data-cx-analytics-eng-team | 2026-04-20 |
| `coinbase.ghe.com/eaa-eng/cx-frontend` | 1 | 3 | @eaa-eng/eaa-cdp-support | 2026-04-24 |
| `coinbase.ghe.com/eaa-eng/davaz-test-service` | 1 | 3 | _(no CODEOWNERS)_ | 2026-01-29 |
| `coinbase.ghe.com/eaa-eng/doc-storage-web` | 1 | 3 | @eaa-eng/eaa-onboarding | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/eaa-legal-roadmap` | 1 | 3 | @eaa-eng/eaa-eng | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/em-toolkit` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/eaa-eng/ewx-ops` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/exec-review-tool` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/external-risk-poc-web` | 1 | 3 | @eaa-eng/eaa-marketing | 2026-04-17 |
| `coinbase.ghe.com/eaa-eng/finsight` | 2 | 3 | @eaa-eng/eaa-finance | 2026-04-24 |
| `coinbase.ghe.com/eaa-eng/hr-portal` | 1 | 3 | @eaa-eng/eaa-eng | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/langgraph-typescript-template` | 1 | 3 | @eaa-eng/eaa-marketing | 2026-04-22 |
| `coinbase.ghe.com/eaa-eng/ops-agent` | 1 | 3 | @eaa-eng/eaa-eng | 2026-04-21 |
| `coinbase.ghe.com/eaa-eng/pmbot` | 1 | 3 | @eaa-eng/eaa-customer-agent-interaction-systems | 2026-04-26 |
| `coinbase.ghe.com/eaa-eng/prompt-hub-web` | 1 | 2 | @eaa-eng/eaa-onboarding _(path-scoped)_ | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/support-bridge` | 1 | 2 | @eaa-eng/eaa-onboarding | 2026-04-20 |
| `coinbase.ghe.com/eaa-eng/support-telegram-mini-app` | 1 | 2 | @eaa-eng/eaa-onboarding | 2026-04-14 |
| `coinbase.ghe.com/eaa-eng/telegram-mini-app` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/eaa-eng/test-reorg-agent` | 1 | 3 | @eaa-eng/eaa-eng | 2026-04-21 |
| `coinbase.ghe.com/eaa-eng/workplace-health` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/engineering/incidentbot-fe` | 1 | 3 | @engineering/reliability-observability | 2026-04-21 |
| `coinbase.ghe.com/engineering/org-view` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-17 |
| `coinbase.ghe.com/exchange/international-ui` | 1 | 4 | @exchange/neptune-ui | 2026-04-20 |
| `coinbase.ghe.com/exchange/lineart` | 1 | 3 | @exchange/exchange-eng | 2026-04-18 |
| `coinbase.ghe.com/exchange/starbase-platform` | 2 | 3 | @exchange/dcm-dev / @exchange/exchange-eng | 2026-04-26 |
| `coinbase.ghe.com/finhub/finhub-tools-frontend` | 2 | 3 | @finhub/finhub-tooling-platform | 2026-04-24 |
| `coinbase.ghe.com/frontend/ai-limits-ui` | 1 | 4 | @frontend/ai-accelerator / @frontend/genai-platform-team | 2026-04-24 |
| `coinbase.ghe.com/frontend/bootcamp` | 1 | 3 | @frontend/dx-build-guild _(path-scoped)_ | 2026-04-16 |
| `coinbase.ghe.com/frontend/borrow-repay-site` | 2 | 2 | @frontend/retail-defi-borrow | 2026-04-23 |
| `coinbase.ghe.com/frontend/cb-mcp` | 1 | 3 | @frontend/devx _(path-scoped)_ | 2026-04-24 |
| `coinbase.ghe.com/frontend/cds-themes` _(CDS itself)_ | 1 | 3 | _(no CODEOWNERS)_ | 2026-03-24 |
| `coinbase.ghe.com/frontend/coinbase-agents-landing` | 1 | 3 | @frontend/ai-accelerator | 2026-04-21 |
| `coinbase.ghe.com/frontend/design-playground` | 1 | 3 | @frontend/devx | 2026-04-16 |
| `coinbase.ghe.com/frontend/dev-platform` | 1 | 3 | @frontend/dev-platform | 2026-04-24 |
| `coinbase.ghe.com/frontend/insights` | 1 | 1 | @frontend/eng | 2026-04-15 |
| `coinbase.ghe.com/frontend/itp-example` | 1 | 1 | @frontend/security-eng-iam | 2026-03-24 |
| `coinbase.ghe.com/frontend/llm-gateway-proxy` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/frontend/nsm-nextjs` | 1 | 3 | @frontend/dev-platform | 2026-04-21 |
| `coinbase.ghe.com/frontend/nx-tools` | 2 | 2 | @frontend/devx | 2026-04-24 |
| `coinbase.ghe.com/frontend/onboarding-playground-web` | 1 | 2 | _(no CODEOWNERS)_ | 2026-02-12 |
| `coinbase.ghe.com/frontend/portfolio-web` | 1 | 1 | @mono/trading-platform-custodian | 2026-04-21 |
| `coinbase.ghe.com/frontend/raise-console` | 1 | 2 | @frontend/raise | 2026-04-22 |
| `coinbase.ghe.com/frontend/test-si-frontend-1` | 1 | 3 | @frontend/compliance_spec_invest | 2026-04-09 |
| `coinbase.ghe.com/frontend/ui-test-playground` | 1 | 3 | @frontend/dev-platform | 2026-04-21 |
| `coinbase.ghe.com/frontend/unified-identity-accounts` | 1 | 3 | @frontend/identity-frontend | 2026-04-24 |
| `coinbase.ghe.com/hackathon/test-si` | 1 | 3 | @hackathon/compliance_spec_invest | 2026-04-08 |
| `coinbase.ghe.com/hackathon/test-si-3` | 1 | 3 | @hackathon/compliance_spec_invest | 2026-04-08 |
| `coinbase.ghe.com/hackathon/test-si-frontend-2` | 1 | 3 | @hackathon/compliance_spec_invest | 2026-04-09 |
| `coinbase.ghe.com/identity/Account-PED` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-20 |
| `coinbase.ghe.com/identity/design` | 1 | 1 | _(no CODEOWNERS)_ | 2026-04-17 |
| `coinbase.ghe.com/infra/agent-skills` | 1 | 3 | @infra/dx-ai-tools-pod | 2026-04-25 |
| `coinbase.ghe.com/infra/api-registry` | 1 | 3 | @infra/dx-author-guild | 2026-04-24 |
| `coinbase.ghe.com/infra/armada-frontend` | 2 | 2 | @infra/datastores | 2026-04-17 |
| `coinbase.ghe.com/infra/build-tools-report` | 1 | 2 | @infra/dx-test-xp-guild _(path-scoped)_ | 2026-04-15 |
| `coinbase.ghe.com/infra/cloud-custodian` | 1 | 2 | @infra/infra-ccoe | 2026-04-22 |
| `coinbase.ghe.com/infra/codeflow-www` | 1 | 2 | @infra/devx | 2026-04-25 |
| `coinbase.ghe.com/infra/codeflowv2-migrator` | 1 | 3 | @infra/dev-platform | 2026-04-13 |
| `coinbase.ghe.com/infra/finops-hub-portal` | 1 | 4 | _(no CODEOWNERS)_ | 2026-04-24 |
| `coinbase.ghe.com/infra/mesh-migration-agent` | 1 | 3 | @infra/infra _(path-scoped)_ | 2026-04-16 |
| `coinbase.ghe.com/infra/migrations` | 1 | 3 | @infra/devx | 2026-04-25 |
| `coinbase.ghe.com/infra/nsm-nx-fort-test-001` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/infra/nsm-nx-template-test-014` | 1 | 3 | @infra/dev-platform | 2026-04-20 |
| `coinbase.ghe.com/infra/nsm-nx-template-test-020` | 1 | 3 | @infra/dev-platform | 2026-04-21 |
| `coinbase.ghe.com/infra/nsm-nx-test-010` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/infra/nsm-test-citadel024` | 1 | 3 | @infra/dev-platform | 2026-04-21 |
| `coinbase.ghe.com/infra/nx-repo-template` | 1 | 3 | @infra/dev-platform | 2026-04-23 |
| `coinbase.ghe.com/infra/nx-repo-template-legacy` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/infra/nx-test-repo-nextjs-001` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/infra/ownership-registry` | 1 | 2 | @infra/security-itam | 2026-04-22 |
| `coinbase.ghe.com/infra/pipelines-editor` | 1 | 3 | @infra/dev-platform | 2026-04-23 |
| `coinbase.ghe.com/infra/predictions-landing-page-prototype` | 1 | 3 | @infra/dev-platform | 2026-04-21 |
| `coinbase.ghe.com/infra/provisioner` | 1 | 3 | @infra/cloud-provisioning | 2026-04-24 |
| `coinbase.ghe.com/infra/quality-dashboard` | 1 | 3 | @infra/quality-platform | 2026-04-24 |
| `coinbase.ghe.com/infra/resilience` | 1 | 3 | @infra/reliability-core | 2026-04-20 |
| `coinbase.ghe.com/institutional/glide` | 1 | 3 | _(no CODEOWNERS)_ | 2026-03-04 |
| `coinbase.ghe.com/institutional/liquifi-frontend` | 1 | 2 | @institutional/liquifi-eng | 2026-04-24 |
| `coinbase.ghe.com/it/identity` | 1 | 4 | @it/it-set-security | 2026-03-30 |
| `coinbase.ghe.com/payments/cbpay-rn-sdk` | 2 | 3 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/payments/coinbox-ui` | 1 | 3 | @payments/payments-core | 2026-04-15 |
| `coinbase.ghe.com/payments/onramp-widget` | 2 | 3 | @payments/cbpay | 2026-04-23 |
| `coinbase.ghe.com/prime/mobile` | 1 | 3 | @prime/pw3w-eng | 2026-04-24 |
| `coinbase.ghe.com/protocols/base-dev-frontend` | 1 | 3 | @protocols/web3-protocols | 2026-04-23 |
| `coinbase.ghe.com/protocols/base-verify-mini-app` | 1 | 3 | @protocols/base-privacy-eng | 2026-04-01 |
| `coinbase.ghe.com/protocols/join-base-app` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/retail/assets` | 1 | 1 | @retail/dex-eng | 2026-04-27 |
| `coinbase.ghe.com/retail/card-admin` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/retail/dex-pid-tuner-ui` | 1 | 2 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/retail/fixed-calculator-tool` | 1 | 2 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/retail/growth-docs` | 1 | 3 | @retail/growth-notifications | 2026-04-22 |
| `coinbase.ghe.com/retail/internal-admin` | 1 | 3 | @retail/growth-advocacy | 2026-04-22 |
| `coinbase.ghe.com/retail/lr-campaign-manager` | 1 | 3 | @retail/promo-products-ped | 2026-04-21 |
| `coinbase.ghe.com/retail/presentation-portal` | 2 | 2 | @retail/growth-foundations | 2026-04-24 |
| `coinbase.ghe.com/retail/rat-investigation-helper` | 1 | 1 | _(no CODEOWNERS)_ | 2026-03-30 |
| `coinbase.ghe.com/retail/rex` | 1 | 3 | @retail/retail-defi-lend | 2026-04-24 |
| `coinbase.ghe.com/retail/st-investigation-helper` | 1 | 1 | _(no CODEOWNERS)_ | 2026-03-27 |
| `coinbase.ghe.com/risk/analytics` | 1 | 3 | @risk/ato-risk-eng | 2026-04-25 |
| `coinbase.ghe.com/risk/caseflow-frontend` | 1 | 3 | @risk/risk-platform-eng | 2026-04-23 |
| `coinbase.ghe.com/risk/design` | 1 | 2 | _(no CODEOWNERS)_ | 2026-04-27 |
| `coinbase.ghe.com/risk/risk-ai-hub` | 1 | 3 | @risk/payments-risk-eng | 2026-04-23 |
| `coinbase.ghe.com/risk/threat-investigation-portal-frontend` | 2 | 2 | @risk/risk-platform-eng | 2026-04-24 |
| `coinbase.ghe.com/security/appsec-codelab-3` | 1 | 3 | @security/security-product-assessments | 2026-04-21 |
| `coinbase.ghe.com/security/appsec-metrics` | 1 | 3 | @security/security-product-assessments | 2026-04-23 |
| `coinbase.ghe.com/security/automated-threat-modeling` | 1 | 3 | @security/security-product-blockchain | 2026-04-23 |
| `coinbase.ghe.com/security/bug-bounty-security` | 1 | 3 | @security/app-sec | 2026-04-13 |
| `coinbase.ghe.com/security/conduit` | 1 | 3 | @security/security | 2026-04-15 |
| `coinbase.ghe.com/security/hodor-tuner` | 2 | 1 | _(no CODEOWNERS)_ | 2026-03-26 |
| `coinbase.ghe.com/security/ivy-admin-ui` | 1 | 3 | @security/custodysec-ops | 2026-04-21 |
| `coinbase.ghe.com/security/nexus-ui` | 1 | 4 | @security/security-platform-eng-irm | 2026-04-24 |
| `coinbase.ghe.com/security/onchain-tx-monitoring` | 1 | 3 | @security/security-ops | 2026-04-17 |
| `coinbase.ghe.com/security/reindeer` | 1 | 3 | _(no CODEOWNERS)_ | 2026-03-23 |
| `coinbase.ghe.com/security/security-hub` | 2 | 3 | @security/security-itam | 2026-04-25 |
| `coinbase.ghe.com/security/security-test-app` | 1 | 3 | @security/security | 2026-04-15 |
| `coinbase.ghe.com/security/testing-collin` | 1 | 3 | @security/security-product-partners | 2026-04-16 |
| `coinbase.ghe.com/security/threat-intel-alerts-dashboard` | 1 | 3 | @security/security-vuln-mgmt | 2026-04-07 |
| `coinbase.ghe.com/security/vindicti` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-15 |
| `coinbase.ghe.com/security/vuln-mgmt-app` | 1 | 3 | @security/security-vuln-mgmt | 2026-04-17 |
| `coinbase.ghe.com/solutions-architecture/token-tools` | 1 | 3 | @solutions-architecture/institutional-sales-engineering-admins | 2026-04-23 |
| `coinbase.ghe.com/wallet/adaptive-config` | 1 | 3 | @wallet/tba-messaging-pod | 2026-04-16 |
| `coinbase.ghe.com/wallet/asset-data-service-admin` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-23 |
| `coinbase.ghe.com/wallet/base-ads-admin-ui` | 1 | 3 | @wallet/base-ads | 2026-04-23 |
| `coinbase.ghe.com/wallet/base-ads-app` | 1 | 3 | _(no CODEOWNERS)_ | 2026-04-21 |
| `coinbase.ghe.com/wallet/base-llm-annotator` | 2 | 3 | @wallet/wallet-social-creators-eng | 2026-04-16 |
| `coinbase.ghe.com/wallet/base-qa-superapp` | 1 | 3 | @wallet/wallet-qa-eng | 2026-04-24 |
| `coinbase.ghe.com/wallet/collab` | 1 | 3 | @wallet/tba-payments-pod | 2026-04-15 |
| `coinbase.ghe.com/wallet/create-figma` | 1 | 3 | @wallet/tba-payments-pod | 2026-04-21 |
| `coinbase.ghe.com/wallet/tba-social-image-generator` | 1 | 3 | @wallet/wallet-social-creators-eng | 2026-04-13 |

---

## Appendix: Stale repos dropped

No human commits on default branch since 2025-10-27 — excluded from migration scope.

- `coinbase.ghe.com/c3/web-mpc-playground` (last commit: 2022-05-05)
- `coinbase.ghe.com/hackathon/quote-frontend` (last commit: 2023-03-09)
- `coinbase.ghe.com/eaa-eng/pynest` (last commit: 2023-03-23)
- `coinbase.ghe.com/commerce/www` (last commit: 2024-12-05)
- `coinbase.ghe.com/wallet/social-image-generation` (last commit: 2025-06-04)
- `coinbase.ghe.com/intl/frontend-bootcamp-jiayuan-chee` (last commit: 2025-07-30)
- `coinbase.ghe.com/wallet/testbench-wallet-mobile` (last commit: 2025-08-11)

## Appendix: Methodology

- **Search:** Sourcegraph MCP for `package.json` deps + import statements referencing `@coinbase/cds-*` / `@cbhq/cds-*`.
- **Activity filter:** Last commit on default branch ≥ 2025-10-27 (6 months). Bot-only commits don't count.
- **Sub-area buckets (Tier 1):** Each CDS-importing file matched against `.github/CODEOWNERS` (last-rule-wins). Buckets grouped at logical app/lib/package level.
- **Owner teams:** From CODEOWNERS, validated against `coinbase.ghe.com` org/team API.
- **Top contributors per sub-area:** `GET /repos/.../commits?path=<bucket>&since=2025-10-27` (last 6mo), counted per author login, top 3 with bots filtered.
- **Top contributors per repo (Tier 2/3):** `GET /repos/.../contributors` — *lifetime* commit count, top 3 humans.
- **Caps:** Sourcegraph 5,000-hit cap was reached for the two monorepo import-statement scans, so file counts are floors. Logical-bucket counts are accurate, but absolute file totals are conservative.
- **Stale handles:** ~40 CODEOWNERS team handles 404 on GHE. Flagged inline as `_(stale; rename?: ...)_`.
