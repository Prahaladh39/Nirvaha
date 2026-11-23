import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { CheckCircle2, QrCode } from 'lucide-react-native';
import { theme } from '../../constants/theme';

// Import vendor QRCode model
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCodeModel = require('qrcode-terminal/vendor/QRCode');

interface TicketPassQRProps {
  bookingReference: string;
  eventId?: string;
  bookingId?: string;
  status?: string;
  size?: number;
  showCode?: boolean;
}

export default function TicketPassQR({
  bookingReference,
  eventId,
  bookingId,
  status = 'confirmed',
  size = 180,
  showCode = true,
}: TicketPassQRProps) {
  // Construct verification payload
  const qrPayload = useMemo(() => {
    // Encodes standardized Nirvaha pass format
    return `nirvaha://pass?ref=${encodeURIComponent(bookingReference)}&id=${encodeURIComponent(bookingId || '')}&event=${encodeURIComponent(eventId || '')}`;
  }, [bookingReference, bookingId, eventId]);

  // Generate SVG path for QR modules
  const { pathData, moduleCount } = useMemo(() => {
    try {
      // typeNumber: 0 (auto-detect version), errorCorrection: 1 (Medium / M)
      const qr = new QRCodeModel(0, 1);
      qr.addData(qrPayload);
      qr.make();

      const count: number = qr.getModuleCount();
      const cellSize = size / count;
      let path = '';

      for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
          if (qr.isDark(row, col)) {
            const x = (col * cellSize).toFixed(2);
            const y = (row * cellSize).toFixed(2);
            const w = cellSize.toFixed(2);
            const h = cellSize.toFixed(2);
            path += `M${x},${y}h${w}v${h}h-${w}Z `;
          }
        }
      }

      return { pathData: path, moduleCount: count };
    } catch (e) {
      console.warn('QR Code generation fallback:', e);
      return { pathData: '', moduleCount: 21 };
    }
  }, [qrPayload, size]);

  const isAttended = status === 'attended';

  return (
    <View style={styles.container}>
      {/* Outer Card with Gold Accents */}
      <View style={[styles.qrWrapper, { width: size + 32, height: size + 32 }]}>
        {/* Decorative Corner Accents */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* High-Contrast White Surface for Optical Scanners */}
        <View style={[styles.surface, { width: size + 16, height: size + 16 }]}>
          {pathData ? (
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <Rect x="0" y="0" width={size} height={size} fill="#FFFFFF" />
              <Path d={pathData} fill="#0A0A0A" />
            </Svg>
          ) : (
            <View style={[styles.fallbackBox, { width: size, height: size }]}>
              <QrCode size={48} color={theme.colors.gold} />
              <Text style={styles.fallbackText}>{bookingReference}</Text>
            </View>
          )}

          {/* Attended / Checked-in Stamp Overlay */}
          {isAttended && (
            <View style={[styles.attendedOverlay, { width: size + 16, height: size + 16 }]}>
              <View style={styles.attendedBadge}>
                <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 5 }} />
                <Text style={styles.attendedText}>CHECKED IN</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Human Readable Reference Code */}
      {showCode && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>PASS REFERENCE</Text>
          <Text style={styles.codeText}>{bookingReference}</Text>
          <Text style={styles.scanHint}>Present this QR pass at the sanctuary entrance</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 14,
  },
  qrWrapper: {
    position: 'relative',
    backgroundColor: '#121A15',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: theme.colors.gold,
  },
  cornerTL: {
    top: 4,
    left: 4,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 4,
    right: 4,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 4,
    left: 4,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 4,
    right: 4,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  attendedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(10, 26, 18, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34D399',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  attendedText: {
    color: '#FFFFFF',
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  fallbackBox: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  fallbackText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: '#0A0A0A',
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  codeContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  codeLabel: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  codeText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.gold,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  scanHint: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 3,
    textAlign: 'center',
  },
});
