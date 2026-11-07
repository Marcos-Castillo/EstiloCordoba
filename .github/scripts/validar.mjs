#!/usr/bin/env node
// Validador sin dependencias para la SPA (HTML + JavaScript).
// Comprueba sintaxis de los scripts, referencias locales de HTML y estructura de etiquetas.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const RAIZ = process.cwd();
const APP = join(RAIZ, "docs", "app");
const IGNORAR = new Set(["vendor", "node_modules", ".git"]);

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const errores = [];
let htmls = 0;
let scripts = 0;

function recorrer(directorio) {
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    if (IGNORAR.has(entrada.name)) continue;

    const ruta = join(directorio, entrada.name);
    if (entrada.isDirectory()) {
      recorrer(ruta);
    } else if (entrada.name.endsWith(".html")) {
      validarHtml(ruta);
      htmls += 1;
    } else if (entrada.name.endsWith(".js")) {
      validarJs(ruta);
      scripts += 1;
    }
  }
}

function ubicacion(texto, indice) {
  return texto.slice(0, indice).split("\n").length;
}

function validarJs(ruta) {
  try {
    execFileSync(process.execPath, ["--check", ruta], { stdio: "pipe" });
  } catch (error) {
    const detalle = (error.stderr || "").toString().trim().split("\n")[0];
    errores.push(`${relative(RAIZ, ruta)}: sintaxis inválida -> ${detalle}`);
  }
}

function validarHtml(ruta) {
  const contenido = readFileSync(ruta, "utf8");
  const relativo = relative(RAIZ, ruta);

  // Referencias locales (href/src) que deben existir en el repositorio.
  const referencia = /(?:href|src)\s*=\s*"([^"]+)"/gi;
  let coincidencia;
  while ((coincidencia = referencia.exec(contenido)) !== null) {
    const valor = coincidencia[1].trim();
    if (/^(?:https?:|\/\/|data:|mailto:|javascript:|#)/i.test(valor)) continue;

    const limpio = valor.split("#")[0].split("?")[0];
    if (!limpio) continue;

    const destino = resolve(dirname(ruta), limpio);
    if (!existsSync(destino)) {
      errores.push(`${relativo}:${ubicacion(contenido, coincidencia.index)} referencia inexistente -> ${valor}`);
    }
  }

  // Identificadores únicos por documento.
  const ids = new Map();
  const idRegex = /\bid\s*=\s*"([^"]+)"/gi;
  while ((coincidencia = idRegex.exec(contenido)) !== null) {
    const id = coincidencia[1];
    if (ids.has(id)) {
      errores.push(`${relativo}:${ubicacion(contenido, coincidencia.index)} id duplicado -> ${id}`);
    } else {
      ids.set(id, true);
    }
  }

  // Equilibrio de etiquetas (se omite el contenido de script/style).
  const sinContenidoInterno = contenido.replace(
    /<(script|style)\b([^>]*)>[\s\S]*?<\/\1>/gi,
    "<$1$2></$1>",
  );
  const pila = [];
  const etiqueta = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;
  while ((coincidencia = etiqueta.exec(sinContenidoInterno)) !== null) {
    const cierre = coincidencia[1] === "/";
    const nombre = coincidencia[2].toLowerCase();
    const autocierre = coincidencia[4] === "/";

    if (VOID.has(nombre) || autocierre) continue;

    if (!cierre) {
      pila.push({ nombre, indice: coincidencia.index });
      continue;
    }

    const abierta = pila.pop();
    if (!abierta) {
      errores.push(`${relativo}:${ubicacion(sinContenidoInterno, coincidencia.index)} cierre sin apertura -> </${nombre}>`);
      continue;
    }

    if (abierta.nombre !== nombre) {
      errores.push(
        `${relativo}:${ubicacion(sinContenidoInterno, coincidencia.index)} se esperaba </${abierta.nombre}> y se encontró </${nombre}>`,
      );
    }
  }

  for (const abierta of pila) {
    errores.push(
      `${relativo}:${ubicacion(sinContenidoInterno, abierta.indice)} etiqueta sin cerrar -> <${abierta.nombre}>`,
    );
  }
}

if (!statSync(APP).isDirectory()) {
  console.error(`No existe el directorio ${relative(RAIZ, APP)}`);
  process.exit(1);
}

recorrer(APP);

if (errores.length > 0) {
  console.error(`Se encontraron ${errores.length} problema(s):`);
  for (const error of errores) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`OK: ${htmls} archivo(s) HTML y ${scripts} archivo(s) JavaScript validados.`);
