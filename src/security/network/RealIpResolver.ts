import { forwardedForParser } from "./ForwardedForParser";

export class RealIpResolver {
  constructor(private readonly parser = forwardedForParser) {}

  fromHeader(header: string | null | undefined) {
    return this.parser.normalize(header ?? "");
  }
}

export const realIpResolver = new RealIpResolver();
