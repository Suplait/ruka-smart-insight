
export interface Lead {
  id?: number;
  company_name: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  ccity: string;
  whatsapp?: string;
  meses_datos?: number;
  sistema_facturacion?: string;
  sistema_custom?: string;
  subdominio?: string;
  rut?: string;
  clave_sii?: string;
  sii_connected?: boolean;
  slack_message_ts?: string;
  created_at?: string;
  facturas_compra_mes?: number;
  requires_calendly?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}
