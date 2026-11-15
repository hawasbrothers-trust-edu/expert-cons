export const WEB3FORMS_ACCESS_KEY = '8ba5ef7a-eea0-4a02-905a-b3bcfff1c247';
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export interface Web3FormsPayload {
  subject: string;
  from_name?: string;
  name?: string;
  email?: string;
  replyto?: string;
  message: string;
  [key: string]: string | boolean | number | undefined;
}

export interface Web3FormsResult {
  success: boolean;
  message: string;
}

export async function sendWeb3FormsEmail(payload: Web3FormsPayload): Promise<Web3FormsResult> {
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        from_name: payload.from_name || 'EXPERT Economic Consultation',
        ...payload,
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;

    if (!response.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      message: data.message || 'Email dispatched successfully via Web3Forms',
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Network error sending email',
    };
  }
}
