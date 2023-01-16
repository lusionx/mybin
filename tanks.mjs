/**
 * curl 'https://tanks.gg/api/v11910/tank/wz-113g-ft'
 * list from page https://tanks.gg/list
 * [...document.querySelectorAll(".bg-lightest")].map(e=>[...e.parentElement.querySelectorAll("a")].map(a=>a.getAttribute("href").slice(5))).flat()
 */

const zArgv = argv
const zArgs = argv._
const l10 = ["/r-t-62a", "/121", "/121b", "/amx-30-b", "/b-c-25-t", "/carro-45-t", "/centurion-ax", "/cs-63", "/e-50-m", "/fv4202", "/k-91", "/leopard-1", "/leopard-1-bb", "/lion", "/m48t54e2", "/m48-patton", "/m48a5-7v7", "/m60", "/obj-140", "/obj-140-cl", "/obj-430b", "/obj-430u", "/obj-907", "/obj-907a", "/progetto-65", "/progetto-65-bb", "/stb-1", "/t-22-med", "/t-62a", "/t95e6", "/tvp-t-5051", "/udes-1516", "/r-amx-50-b", "/r-is-7", "/113", "/113-p", "/113-bo", "/116-f3", "/60tp", "/amx-50-b", "/amx-m4-54", "/bz-75", "/chieftain", "/e-100", "/fv215b", "/is-4", "/is-4-7v7", "/is-7", "/kranvagn", "/kranvagn-bb", "/m-v-y", "/maus", "/obj-257-pa", "/obj-260", "/obj-277", "/obj-279-e", "/obj-705a", "/obj-777-d", "/obj-780", "/pzkpfw-vii", "/rinoceronte", "/st-ii", "/s-conqueror", "/t110e5", "/t110e5-cl", "/t57-heavy", "/t95chieftain", "/t95fv4201", "/type-5-h", "/vk-7201-k", "/vz-55", "/vz-55-gw", "/wz-111-5a", "/wz-111-5a-7", "/wz-111-ql", "/114-sp2", "/foch-155", "/foch-b", "/minotauro", "/fv215b-183", "/badger", "/badger-7v7", "/fv4005", "/grille-15", "/jgpz-e-100", "/obj-263b", "/obj-268", "/obj-2684", "/obj-2685", "/strv-103b", "/t110e3", "/t110e4", "/wt-e-100", "/wt-e-100-mod", "/wt-12", "/wz-113g-ft", "/amx-13-105", "/amx-13-105-7", "/manticore", "/ebr-105", "/rhm-pzw", "/t-100-lt", "/wz-132-1", "/sheridan", "/b-c-155-58", "/conquerorgc", "/gw-e-100", "/obj-261", "/t92-hmc"]

/**
 * @param {string[]} names
 */
async function tankDb(names = l10) {
    if (names.length === 0) {
        names = l10
    }
    const list = await Promise.all(
        names.map(async (e) => {
            if (e[0] !== '/') {
                e = '/' + e
            }
            const response = await fetch("https://tanks.gg/api/v11910/tank" + e);
            const data = await response.json();
            return data.tank
        })
    );
    return list
}

const shellTypes = new Map([['ARMOR_PIERCING', "AP"], ["HIGH_EXPLOSIVE", "HE"], ["ARMOR_PIERCING_CR", "APCR"], ["HOLLOW_CHARGE", "HEAT"]])

function format(e, qy) {
    const ss = [chalk.green(e.slug) + `[${e.short_name}]`]
    ss.push(chalk.green(e.tier) + `[${e.type}]`)
    const d = chalk.red("d")
    const p = chalk.magenta("p")
    e.shells.map(s => {
        const t = shellTypes.get(s.type)        
        ss.push(chalk.cyan(t) + `/${s.damage}${d}/${s.penetration}${p}`)
    })
    ss.push()
    return ss.join(" ")
}

async function main() {
    let list = await tankDb(zArgs)
    const qs = qFilter(zArgv)
    list = list.filter(e => qs.every(q => q(e)))
    list.map(e => console.log(format(e)))
}

/**
 * 
 * @param {*} qy 
 * @returns {Function[]}
 */
function qFilter(qy) {
    const qs = []    
    if (qy.ap) {
        qs.push(e => e.shells.some(s => s.type === "ARMOR_PIERCING" && s.penetration >= +qy.ap))
    }
    if (qy.apcr) {
        qs.push(e => e.shells.some(s => s.type === "ARMOR_PIERCING_CR" && s.penetration >= +qy.apcr))
    }
    if (qy.he) {
        qs.push(e => e.shells.some(s => s.type === "HIGH_EXPLOSIVE" && s.penetration >= +qy.he))
    }
    if (qy.heat) {
        qs.push(e => e.shells.some(s => s.type === "HOLLOW_CHARGE" && s.penetration >= +qy.heat))
    }
    if (qy.gun) {
        qs.push(e => e.shells.some(s => s.penetration >= +qy.gun))
    }
    return qs
}

process.nextTick(async () => {
    try {
        await main()
    } catch (err) {
        console.error(err)
    }
})